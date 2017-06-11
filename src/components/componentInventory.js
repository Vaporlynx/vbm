import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        width: 210px;
      }

      .hidden {
        display: none;
      }
    </style>

    <vpl-label text="Internal Components">
    </vpl-label>
    <div id="inventory">
    </div>
  `);

  customElements.define("vpl-component-inventory", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();

      this._inventory = null;
      this._def = null;
      this._componentTemplate = {
        ComponentDefID: "",
        ComponentDefType: "",
        MountedLocation: "",
        HardpointSlot: -1,
        DamageLevel: "Functional",
        prefabName: null,
        hasPrefabName: false,
      };

      // this.nameElem = this.shadowRoot.getElementById("name");
    }

    get inventory() {
      return this._inventory;
    }

    set inventory(inventory) {
      if (this._inventory !== inventory) {
        this._inventory = inventory;
        this.buildInventoryList();
      }
    }

    get def() {
      return this._def;
    }

    set def(val) {
      this._def = val;
    }

    buildInventoryList() {

    }
  });
})();
