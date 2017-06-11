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
      this._def = null;

      this.nameElem = this.shadowRoot.getElementById("name");

      this.healthElem = this.shadowRoot.getElementById("health");
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

    get def() {
      return this._def;
    }

    set def(val) {
      this._def = val;
    }

    buildComponent() {
      this.nameElem.text = this.component.Location;
      this.healthElem.armor = {
        maxArmor: this.def.MaxArmor,
        maxRearArmor: this.def.MaxRearArmor,
        internal: this.def.InternalStructure,
        currentArmor: this.component.AssignedArmor,
        currentRearArmor: this.component.AssignedRearArmor,
      };
      this.healthElem.addEventListener("attributeChanged", event => {
        this.component[event.detail.property === "currentArmor" ? "AssignedArmor" : "AssignedRearArmor"] = event.detail.value;
      });
    }
  });
})();
