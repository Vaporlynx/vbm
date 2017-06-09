import "./init.js";

import "./components/element.js";

// import fuse from "fuse.js";

import * as templateHelper from "./helpers/template.js";

// TODO: fire off appropriate event when we get a menu command from the main thread
require("electron").ipcRenderer.on("menuCommand", (event, message) => {
  console.log(message);  // Prints 'whoooooooh!'
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

  initializedCallback() {
    super.initializedCallback();
  }
});
