import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }

      .container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }

      .container > * {
        margin-right: 3px;
      }

      .hidden {
        display: none;
      }
    </style>

    <vpl-label id="name" style="align-self: center;">
    </vpl-label>
    <div id="headContainer" style="display: flex; flex-direction: column;">
      <vpl-mech-component id="head" style="align-self: center;">
      </vpl-mech-component>
    </div>
    <div id="chestContainer" class=container>
      <vpl-mech-component id="leftArm">
      </vpl-mech-component>
      <vpl-mech-component id="leftTorso">
      </vpl-mech-component>
      <vpl-mech-component id="centerTorso">
      </vpl-mech-component>
      <vpl-mech-component id="rightTorso">
      </vpl-mech-component>
      <vpl-mech-component id="rightArm">
      </vpl-mech-component>
    </div>
    <div id="legsContainer" class=container>
      <vpl-mech-component id="leftLeg">
      </vpl-mech-component>
      <vpl-mech-component id="rightLeg">
      </vpl-mech-component>
    </div>

  `);

  customElements.define("vpl-mech", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();

      this._data = null;
      this._defs = null;

      this.nameElem = this.shadowRoot.getElementById("name");

      this.headElem = this.shadowRoot.getElementById("head");

      this.leftArmElem = this.shadowRoot.getElementById("leftArm");

      this.leftTorsoElem = this.shadowRoot.getElementById("leftTorso");

      this.centerTorsoElem = this.shadowRoot.getElementById("centerTorso");

      this.rightTorsoElem = this.shadowRoot.getElementById("rightTorso");

      this.rightArmElem = this.shadowRoot.getElementById("rightArm");

      this.leftLegElem = this.shadowRoot.getElementById("leftLeg");

      this.rightLegElem = this.shadowRoot.getElementById("rightLeg");
    }

    get defs() {
      return this._defs;
    }

// TODO: find a better way to propogate defs to mechComponents
    set defs(val) {
      this._defs = val;
    }

    buildMech(mech) {
      console.log(`Building mech: ${mech.Description.Name}`);
      this.nameElem.text = mech.Description.Name;
      for (const location of mech.Locations) {
        location.inventory = mech.inventory.filter(i => i.MountedLocation === location.Location).map(item => {
          item.def = this.defs[item.ComponentDefType.toLowerCase()][item.ComponentDefID];
          return item;
        });
        const camelCaseName = `${location.Location.slice(0, 1).toLowerCase()}${location.Location.slice(1)}`;
        this[`${camelCaseName}Elem`].componentDef = this.defs.chassis[mech.ChassisID][location.Location];
        this[`${camelCaseName}Elem`].defs = this.defs;
        this[`${camelCaseName}Elem`].component = location;
      }
    }
  });
})();
