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
      ipcRenderer.send("fsCommand", {command: message.command, data: currentMech});
    }
  }
  else {
    console.log(message);
  }
});

const defs = {
  chassis: {},
  amunition: {},
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
  </style>
  <div id="body">
    <vpl-mech id="mech">
    </vpl-mech>
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
