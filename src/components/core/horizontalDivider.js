import * as templateHelper from "../../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        background-color: red;
        min-height: 2px;
        display: flex;
      }
    </style>
  `);

  customElements.define("vpl-horizontal-divider", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();
    }
  });
})();
