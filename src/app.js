import "./init.js";

import {ipcRenderer} from "electron";

import Fuse from "fuse.js";

import * as templateHelper from "./helpers/template.js";

let currentMech = null;

let fuseSearch = null;

// TODO: find a more elegant way of letting the web app know we have a mech
let loadMech = mech => {
  console.log("getMechCallback Called before init!");
};

let defsLoaded = () => {
  console.log("defsLoadedCallback Called before init!");
};

ipcRenderer.on("menuCommand", (event, message) => {
  if (message.command === "load") {
    loadMech(JSON.parse(message.data));
  }
  else if (["save", "export"].includes(message.command)){
    if (currentMech) {
      const mechCopy = JSON.parse(JSON.stringify(currentMech));
      const inventory = [];
      // TODO: pull in a validation and normalization module so we can specify
      // what should be written to the json, instead of what we should strip out
      for (const location of mechCopy.Locations) {
        if (location.inventory.length) {
          inventory.push(...location.inventory.map(i => Object.assign(i, {def: undefined})));
        }
        location.inventory = undefined;
      }
      mechCopy.inventory = inventory;
      if (!mechCopy.MechTags.items.includes("unit_release_ksbeta")) {
        mechCopy.MechTags.items.push("unit_release_ksbeta");
      }
      ipcRenderer.send("fsCommand", {command: message.command, data: mechCopy});
    }
  }
  else {
    console.log(message);
  }
});

// TODO: figure out some solution for the casing issue.
// The JSON defs have inconsistant casing for property names and it drives me up the wall
const defs = {
  chassis: {},
  ammunitionbox: {},
  heatsink: {},
  jumpjet: {},
  movement: {},
  weapon: {},
  mech: {},
};

let inventoryItems = null;

const itemDefs = ["ammunitionbox", "heatsink", "jumpjet", "weapon"];


ipcRenderer.on("gameDirectorySet", (event, message) => {
  for (const def of Object.keys(defs)) {
    ipcRenderer.send("fsCommand", {command: "getDefs", type: def});
  }
});

ipcRenderer.on("def", (event, message) => {
  for (const def of message.defs) {
    try {
      const parsed = JSON.parse(def);
      defs[message.type][parsed.Description.Id] = parsed;
      if (itemDefs.includes(message.type)) {
        defsLoaded();
      }
    }
    // The JSON defs have many typos and missing commas, several files fail to parse
    catch (err) {
      console.log(`Failed to parse def, type: ${message.type} def: ${def}`);
    }
  }
});


// TODO: split this  class, the above stuff has to do with loading and
// saving data, the below stuff is ui
const template = templateHelper.create(`
  <style>
    :host {
      background: #040d1b;
      color: #e6e6e6;
      display: flex;
      height: 100%;
      width: 100%;
      overflow: auto;
    }

    .hidden {
      display: none;
    }

    #bgContainer {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      opacity: 0.4;
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: none;
    }

    #equipmentList {
      display: flex;
      flex-direction: column;
      max-height: 100%;
      box-sizing: border-box;
      background:rgba(0,0,0,0.8); /* fallback */
      background:
        linear-gradient(135deg, transparent 10px,rgba(0,0,0,0.8) 0) top left,
        linear-gradient(225deg, transparent 10px,rgba(0,0,0,0.8) 0) top right,
        linear-gradient(315deg, transparent 10px,rgba(0,0,0,0.8) 0) bottom right,
        linear-gradient(45deg,  transparent 10px,rgba(0,0,0,0.8) 0) bottom left;
      background-size: 50% 50%;
      background-repeat: no-repeat;
      padding: 10px;
      padding-bottom: 11px;
      user-select: none;
    }

    #inventory {
      background:rgba(255,255,255,0.2); /* fallback */
      background:
        linear-gradient(135deg, transparent 5px,rgba(255,255,255,0.2) 0) top left,
        linear-gradient(225deg, transparent 5px,rgba(255,255,255,0.2) 0) top right,
        linear-gradient(315deg, transparent 5px,rgba(255,255,255,0.2) 0) bottom right,
        linear-gradient(45deg,  transparent 5px,rgba(255,255,255,0.2) 0) bottom left;
      background-size: 50% 50%;
      background-repeat: no-repeat;
      padding: 5px;
      overflow-y: auto;
    }

    #body {
      z-index: 1;
      width: 100%;
      overflow-x: hidden;
    }
  </style>
  <div id="body">
    <vpl-mech id="mech" class="hidden">
    </vpl-mech>
  </div>
  <div id="equipmentList">
    <input id="equipmentFilter"></input>
    <vpl-table id="inventory">
    </vpl-table>
  </div>
  <div id="bgContainer">
    <img src="assets/bg3.svg" style="width: 720px;">
  </div>
`);

customElements.define("vpl-app", class extends customElements.get("vpl-element") {
  static get template() {
    return template;
  }

  constructor() {
    super();

    this.mechElem = this.shadowRoot.getElementById("mech");
    this.mechElem.defs = defs;
    loadMech = mech => {
      currentMech = mech;
      this.mechElem.classList.remove("hidden");
      this.mechElem.buildMech(mech);
    };

    this.inventoryElem = this.shadowRoot.getElementById("inventory");
    this.inventoryElem.columns = [{
      key: "def.Description.Name",
      handleDragStart: (event, dragData) => {
        event.dataTransfer.effectAllowed = "copyMove";
        const type = dragData.def.Category || "Component";
        event.dataTransfer.setData(`json/${type.toLowerCase()}`, JSON.stringify(dragData));
      },
    }];


    this.equipmentFilterElem = this.shadowRoot.getElementById("equipmentFilter");
    this.equipmentFilterElem.addEventListener("keyup", event => {
      if (this.equipmentFilterElem.value.trim()) {
        this.inventoryElem.items = fuseSearch.search(this.equipmentFilterElem.value.trim());
      }
      else {
        this.inventoryElem.items = inventoryItems;
      }
    });

    defsLoaded = () => {
      const items = [];
      for (const itemType of itemDefs) {
        for (const key of Object.keys(defs[itemType])) {
          if (!key.toLowerCase().includes("template")) {
            const def = defs[itemType][key];
            const item = {
              ComponentDefID: key,
              ComponentDefType: def.ComponentType,
              MountedLocation: "",
              HardpointSlot: -1,
              DamageLevel: "Functional",
              prefabName: null,
              hasPrefabName: false,
              def: def,
            };
            items.push(item);
          }
        }
      }
      this.inventoryElem.items = inventoryItems = items;
      fuseSearch = new Fuse(items, {
        shouldSort: true,
        tokenize: true,
        matchAllTokens: true,
        threshold: 0.3,
        location: 0,
        distance: 100,
        maxPatternLength: 24,
        minMatchCharLength: 1,
        keys: [
          "def.Description.Name",
          "ComponentDefType",
          "def.Type",
          "def.Category",
        ],
        include: ["score"],
      });
    };
  }
});
