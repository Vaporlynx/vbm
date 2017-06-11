import "./init.js";

import {ipcRenderer, dialog} from "electron";

import * as templateHelper from "./helpers/template.js";

let currentMech = null;

// TODO: fire off appropriate event when we get a menu command from the main thread
ipcRenderer.on("menuCommand", (event, message) => {
  if (message.command === "load") {
    currentMech = JSON.parse(message.data);
  }
  else if (["save", "export"].includes(message.command)){
    ipcRenderer.send("fsCommand", {command: message.command, data: currentMech});
  }
  else {
    console.log(message);
  }
});

const defs = {
  chassis: [],
  amunition: [],
  heatsinks: [],
  jumpjets: [],
  movement: [],
  weapon: [],
};

for (const def of Object.keys(defs)) {
  ipcRenderer.send("fsCommand", {command: "getDefs", type: def});
}

// TODO: find out why JSON.parse() failes on the weapon template
ipcRenderer.on("def", (event, message) => {
  for (const def of message.defs) {
    try {
        defs[message.type].push(JSON.parse(def));
    }
    catch (err) {
      console.log(`Failed to parse def: ${err}`);
    }
  }
});


const template = templateHelper.create(`
  <style>
  </style>
  <div id="body">
    <vpl-mech-component id="mechComponent">
    </vpl-mech-component>
  </div>
`);

customElements.define("vpl-app", class extends customElements.get("vpl-element") {
  static get template() {
    return template;
  }

  constructor() {
    super();

    this.mechComponentElem = this.shadowRoot.getElementById("mechComponent");
    this.mechComponentElem.component = {
      DamageLevel: "Functional",
      Location: "Head",
      CurrentArmor: 35,
      CurrentRearArmor: -1,
      CurrentInternalStructure: 15,
      AssignedArmor: 35,
      AssignedRearArmor: -1,
    };
  }
});
