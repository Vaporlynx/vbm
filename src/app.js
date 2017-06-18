import "./init.js";

import {ipcRenderer} from "electron";

import * as templateHelper from "./helpers/template.js";

let currentMech = null;

// TODO: find a more elegant way of letting the web app know we have a mech
let loadMech = mech => {
  console.log("getMechCallback Called before init!");
};

ipcRenderer.on("menuCommand", (event, message) => {
  if (message.command === "load") {
    loadMech(JSON.parse(message.data));
  }
  else if (["save", "export"].includes(message.command)){
    if (currentMech) {
      const mechCopy = JSON.parse(JSON.stringify(currentMech));
      const inventory = [];
      for (const location of mechCopy.Locations) {
        if (location.inventory.length) {
          inventory.push(...location.inventory.map(i => Object.assign(i, {def: undefined})));
        }
        location.inventory = undefined;
      }
      mechCopy.inventory = inventory;
      ipcRenderer.send("fsCommand", {command: message.command, data: mechCopy});
    }
  }
  else {
    console.log(message);
  }
});

const defs = {
  chassis: {},
  ammunitionbox: {},
  heatsink: {},
  jumpjet: {},
  movement: {},
  weapon: {},
  mech: {},
};

for (const def of Object.keys(defs)) {
  ipcRenderer.send("fsCommand", {command: "getDefs", type: def});
}

// TODO: find out why JSON.parse() fails to parse some defs
ipcRenderer.on("def", (event, message) => {
  for (const def of message.defs) {
    try {
      const parsed = JSON.parse(def);
      defs[message.type][parsed.Description.Id] = parsed;
    }
    catch (err) {
      console.log(`Failed to parse def, type: ${message.type} def: ${def}`);
    }
  }
});

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

    #body {
      z-index: 1;
      width: 100%;
      overflow-x: hidden;
    }
  </style>
  <div id="body">
    <vpl-mech id="mech">
    </vpl-mech>
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
      this.mechElem.buildMech(mech);
    };
  }
});
