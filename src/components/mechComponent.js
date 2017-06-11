import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
        width: 200px;
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

      this.nameElem = this.shadowRoot.getElementById("name");

      this.healthElem = this.shadowRoot.getElementById("health");
    }

    set component(data) {
      if (this._data !== data) {
        this._data = data;
        this.buildComponent();
      }
    }

    get component() {
      return this._data;
    }

    buildComponent() {
      this.nameElem.text = this.component.Location;
      // TODO: pull max armor from the chassis def
      this.healthElem.max = this.component.CurrentInternalStructure * (this.component.Location === "Head" ? 3 : 2);
      this.healthElem.internal = this.component.CurrentInternalStructure;
      this.healthElem.current = this.component.AssignedArmor;
      this.healthElem.currentRear = this.component.AssignedRearArmor;
    }
  });
})();
