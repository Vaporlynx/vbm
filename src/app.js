const config = require("../config.json");

import "./init.js";

// import fuse from "fuse.js";
import "./components/element.js";
import * as templateHelper from "./helpers/template.js";

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
