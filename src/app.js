import "./init.js";

import "./components/element.js";

// import fuse from "fuse.js";

import {ipcRenderer} from "electron";

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

const template = templateHelper.create(`
  <style>
  </style>
  <div style="display: flex;">
    Hello.
  </div>
`);

customElements.define("vpl-app", class extends customElements.get("vpl-element") {
  static get template() {
    return template;
  }

  constructor() {
    super();
  }
});
