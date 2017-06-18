import * as templateHelper from "../../helpers/template.js";

(() => {
  const attributes = ["max", "internal", "current", "currentRear", "maxRear"];
  const template = templateHelper.create(`
    <style>
      #healthDisplay > * {
        margin-bottom: 3px;
      }

      .spacedRow {
        display: flex;
        flex-direction: row;
      }

      .spacedColumn {
        display: flex;
        flex-direction: column;
      }

      .hidden {
        display: none;
      }
    </style>

    <div id="healthDisplay" class="hidden" class="spacedColumn">
      <vpl-label id="maxArmor" prefix="Max Armor:&nbsp">
      </vpl-label>
      <vpl-label id="internal" prefix="Internal Structure:&nbsp">
      </vpl-label>
      <div id="forward" class="spacedRow">
        <vpl-label id="currentLabel" prefix="Armor:&nbsp">
        </vpl-label>
        <input id="currentArmor" type="number" step="1" max="100" min="0"></input>
      </div>
      <div id="rear" class="hidden" class="spacedColumn">
        <vpl-horizontal-divider>
        </vpl-horizontal-divider>
        <vpl-label id="maxRearArmor" prefix="Max Rear Armor:&nbsp">
        </vpl-label>
        <div class="spacedRow">
          <vpl-label id="currentRearLabel" prefix="Rear Armor:&nbsp">
          </vpl-label>
          <input id="currentRearArmor" type="number" step="1" max="100" min="0"></input>
          </vpl-label>
        </div>
        <vpl-label id="totalArmor" prefix="Total Armor:&nbsp">
        </vpl-label>
      </div>
      <vpl-label id="weight" prefix="Armor Weight:&nbsp">
    </div>
  `);

  customElements.define("vpl-health-item-renderer", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    static get observedAttributes() {
      return attributes;
    }

    constructor() {
      super();

      this._armor = null;
      this.armorPerTon = 5 * 16;

      this.healthDisplayElem = this.shadowRoot.getElementById("healthDisplay");

      this.maxArmorElem = this.shadowRoot.getElementById("maxArmor");

      this.internalElem = this.shadowRoot.getElementById("internal");

      this.currentArmorElem = this.shadowRoot.getElementById("currentArmor");
      this.currentArmorElem.addEventListener("change", event => {
        this.armor.currentArmor = this.currentArmorElem.value = Math.min(Math.max(this.currentArmorElem.value, 0), this.armor.maxArmor);
        this.calculateTotals();
        this.dispatchEvent(new CustomEvent("attributeChanged", {detail: {property: "currentArmor", value: this.armor.currentArmor}}));
      });

      this.rearElem = this.shadowRoot.getElementById("rear");

      this.maxRearArmorElem = this.shadowRoot.getElementById("maxRearArmor");

      this.currentRearArmorElem = this.shadowRoot.getElementById("currentRearArmor");
      this.currentRearArmorElem.addEventListener("change", event => {
        this.armor.currentRearArmor = this.currentRearArmorElem.value = Math.min(Math.max(this.currentRearArmorElem.value, 0), this.armor.maxRearArmor);
        this.calculateTotals();
        this.dispatchEvent(new CustomEvent("attributeChanged", {detail: {property: "currentRearArmor", value: this.armor.currentRearArmor}}));
      });

      this.totalArmorElem = this.shadowRoot.getElementById("totalArmor");

      this.weightElem = this.shadowRoot.getElementById("weight");
    }

    get armor() {
      return this._armor;
    }

    set armor(val) {
      if (this._armor !== val) {
        this._armor = val;
        if (val) {
          this.healthDisplayElem.classList.remove("hidden");
          if (val.maxRearArmor !== -1) {
            this.rearElem.classList.remove("hidden");
          }
          else {
            this.rearElem.classList.add("hidden");
          }
          this.internalElem.text = val.internal;
          this.maxArmorElem.text = val.maxArmor;
          this.maxRearArmorElem.text = val.maxRearArmor;
          this.currentArmorElem.value = val.currentArmor;
          this.currentArmorElem.max = val.maxArmor;
          this.currentRearArmorElem.value = val.currentRearArmor;
          this.currentRearArmorElem.max = val.maxRearArmor;
          this.calculateTotals();
        }
        else {
          this.healthDisplayElem.clastList.add("hidden");
        }
      }
    }

    calculateTotals() {
      const current = this.armor.currentArmor !== -1 ? this.armor.currentArmor : 0;
      const currentRear = this.armor.currentRearArmor !== -1 ? this.armor.currentRearArmor : 0;
      this.weightElem.text = ((current + currentRear) / this.armorPerTon).toFixed(2);
      this.totalArmorElem.text = current + currentRear;
    }
  });
})();
