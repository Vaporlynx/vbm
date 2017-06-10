import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
    </style>
    <vpl-label id="name">
    <vpl-health-item-renderer id="health">
    </vpl-health-item-renderer>
    <div id="components">
    </div>
  `);

  customElements.define("vpl-mech-component", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();
      
      this._data = null;
    }

    set component(data) {

    }

    get component() {
      return this._data;
    }
  });
})();
