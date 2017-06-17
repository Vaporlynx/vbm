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

    <vpl-label id="name" style="align-self: center;">
    </vpl-label>
    <vpl-health-item-renderer id="health">
    </vpl-health-item-renderer>
    <vpl-component-inventory id="components">
    </vpl-component-inventory>
  `);

  customElements.define("vpl-mech-component", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();

      this._data = null;
      this._defs = null;
      this._componentDef = null;

      this.nameElem = this.shadowRoot.getElementById("name");

      this.healthElem = this.shadowRoot.getElementById("health");

      this.componentsElem = this.shadowRoot.getElementById("components");
    }

    get component() {
      return this._data;
    }

    set component(data) {
      if (this._data !== data) {
        this._data = data;
        this.buildComponent();
      }
    }

    get componentDef() {
      return this._componentDef;
    }

    set componentDef(val) {
      this._componentDef = val;
    }

    get defs() {
      return this._defs;
    }

    set defs(val) {
      this._defs = val;
    }

    buildComponent() {
      this.nameElem.text = this.component.Location;
      this.healthElem.armor = {
        maxArmor: this.componentDef.MaxArmor,
        maxRearArmor: this.componentDef.MaxRearArmor,
        internal: this.componentDef.InternalStructure,
        currentArmor: this.component.AssignedArmor,
        currentRearArmor: this.component.AssignedRearArmor,
      };
      this.healthElem.addEventListener("attributeChanged", event => {
        this.component[event.detail.property === "currentArmor" ? "AssignedArmor" : "AssignedRearArmor"] = event.detail.value;
      });
      this.componentsElem.inventory = this.component.inventory;
    }
  });
})();
