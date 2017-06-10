import * as templateHelper from "../../helpers/template.js";

(() => {
  const attributes = ["max", "internal", "current", "currentRear"];
  const template = templateHelper.create(`
    <style>
      #healthDisplay {
        display: flex;
        flex-direction: column;
      }

      .hidden {
        display: none;
      }
    </style>

    <div id="healthDisplay">
      <vpl-label class="hidden" id="max" prefix="Max Armor:&nbsp">
      </vpl-label>
      <vpl-label class="hidden" id="internal" prefix="Internal Structure:&nbsp">
      </vpl-label>
      <vpl-horizontal-divider>
      </vpl-horizontal-divider>
      <vpl-label class="hidden" id="current" prefix="Current Armor:&nbsp">
      </vpl-label>
      <vpl-label class="hidden" id="currentRear" prefix="Current Rear Armor:&nbsp">
      </vpl-label>
      <vpl-label class="hidden" id="weight" prefix="Armor Weight:&nbsp">
      </vpl-label>
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

      this._max = -1;
      this._internal = -1;
      this._current = -1;
      this._currentRear = -1;

      this._weight = 0;

      this.armorPerTon = 5 * 16;

      this.weightElem = this.shadowRoot.getElementById("weight");

      for (const attribute of attributes) {
        this[`${attribute}Elem`] = this.shadowRoot.getElementById(attribute);
        Object.defineProperty(this, attribute, {
          get: () => this[`_${attribute}`],
          set: val => {
            val = parseInt(val);
            if (this[attribute] !== val) {
              this[`_${attribute}`] = val;
              if (val !== -1) {
                this[`${attribute}Elem`].classList.remove("hidden");
                this[`${attribute}Elem`].text = val;
              }
              else {
                this[`${attribute}Elem`].classList.add("hidden");
              }
              if (["current", "currentRear"].includes(attribute)) {
                this.calculateWeight();
              }
            }
          },
        });
      }
    }

    calculateWeight() {
      const current = this.current !== -1 ? this.current : 0;
      const currentRear = this.currentRear !== -1 ? this.currentRear : 0;
      this.weightElem.text = ((current + currentRear) / this.armorPerTon).toFixed(2);
    }
  });
})();
