import * as templateHelper from "../../helpers/template.js";

(() => {
  const attributes = ["max", "internal", "current", "currentRear"];
  const template = templateHelper.create(`
    <style>
      #healthDisplay {
        display: flex;
        flex-direction: column;
      }

      .armorDiv {
        display: flex;
        flex-cirection: row;
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
      <div id="forward" class="armorDiv">
        <vpl-label id="currentLabel" prefix="Current Armor:&nbsp">
        </vpl-label>
        <input id="current" type="number" step="1" max="100" min="0"></input>
      </div>
      <div id="rear" class="armorDiv" class="hidden">
        <vpl-label id="currentRearLabel" prefix="Current Rear Armor:&nbsp">
        </vpl-label>
        <input id="currentRear" type="number" step="1" max="100" min="0"></input>
        <vpl-label id="weight" prefix="Armor Weight:&nbsp">
        </vpl-label>
      </div>
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

      this.rearElem = this.shadowRoot.getElementById("rear");

      this.weightElem = this.shadowRoot.getElementById("weight");

      for (const attribute of attributes) {
        this[`${attribute}Elem`] = this.shadowRoot.getElementById(attribute);
        Object.defineProperty(this, attribute, {
          get: () => this[`_${attribute}`],
          set: val => {
            val = parseInt(val);
            if (this[attribute] !== val) {
              this[`_${attribute}`] = val;
              const currentElem = this[`${attribute}Elem`];
              if (val !== -1) {
                currentElem.classList.remove("hidden");
                if (currentElem.value !== undefined) {
                  if (attribute === "currentRear") {
                    this.rearElem.classList.remove("hidden");
                  }
                  currentElem.addEventListener("change", event => {
                    this.calculateArmorBounds();
                  });
                  currentElem.value = val;
                }
                else {
                  currentElem.text = val;
                }
              }
              else {
                currentElem.classList.add("hidden");
                if (attribute === "currentRear") {
                  this.rearElem.classList.add("hidden");
                }
              }
              if (["current", "currentRear"].includes(attribute)) {
                this.calculateWeight();
              }
            }
          },
        });
      }

      if (this.currentRear >= 0) {
        this.rearElem.classList.remove("hidden");
      }
      else {
        this.rearElem.classList.add("hidden");
      }
    }

    calculateWeight() {
      const current = this.current !== -1 ? this.current : 0;
      const currentRear = this.currentRear !== -1 ? this.currentRear : 0;
      this.weightElem.text = ((current + currentRear) / this.armorPerTon).toFixed(2);
    }

    calculateArmorBounds() {
      const frontMax = this.max - (this.currentRear !== -1 ? this.currentRear : 0);
      const rearMax = this.max - this.current;
      this.currentElem.value = this.current = Math.max(0, Math.min(frontMax, this.currentElem.value));
      this.currentElem.max = frontMax;
      if (this.currentRear > -1) {
        this.currentRearElem.value = this.currentRear = Math.max(0, Math.min(rearMax, this.currentRearElem.value));
        this.currentRearElem.max = rearMax;
      }
    }
  });
})();
