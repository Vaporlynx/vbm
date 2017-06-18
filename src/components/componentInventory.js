import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }

      .warning {
        background: rgba(255,0,0,0.3);
      }

      #inventory {
        background:rgba(255,255,255,0.2); /* fallback */
        background:
          linear-gradient(135deg, transparent 5px,rgba(255,255,255,0.2) 0) top left,
          linear-gradient(225deg, transparent 5px,rgba(255,255,255,0.2) 0) top right,
          linear-gradient(315deg, transparent 5px,rgba(255,255,255,0.2) 0) bottom right,
          linear-gradient(45deg,  transparent 5px,rgba(255,255,255,0.2) 0) bottom left;
        background-size: 50% 50%;
        background-repeat: no-repeat;
        padding: 5px;
      }

      .hidden {
        display: none;
      }
    </style>

    <vpl-label text="Internal Components">
    </vpl-label>
    <vpl-label id="hardpoints" text="">
    </vpl-label>
    <vpl-table id="inventory">
    </vpl-table>
  `);

  customElements.define("vpl-component-inventory", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();

      this._inventory = null;
      this._defs = null;
      this._componentDef = null;
      this.dragging = false;

      this.inventoryElem = this.shadowRoot.getElementById("inventory");
      this.inventoryElem.columns = [{
        key: "def.Description.Name",
        handleDragStart: (event, dragData) => {
          // TODO: set the data type to the weapon hardpoint type so we can follow construction rules
          event.dataTransfer.effectAllowed = "copyMove";
          const type = dragData.def.Category || "Component";
          event.dataTransfer.setData(`json/${type}`, JSON.stringify(dragData));
          this.dragging = true;
        },
        handleDragEnd: (event, oldIndex) => {
          if (event.dataTransfer.dropEffect === "move") {
            this.inventory = this.inventory.filter((item, index) => index !== oldIndex);
          }
        },
      }];
      this.inventoryElem.addEventListener("dragover", event => {
        if (!this.dragging) {
          event.preventDefault();
        }
      }, false);
      this.inventoryElem.addEventListener("dragenter", event => {
        if (!this.dragging) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }
      }, false);
      this.inventoryElem.addEventListener("drop", event => {
        const item = event.dataTransfer.getData("json/Component") ||
          event.dataTransfer.getData("json/Energy") ||
          event.dataTransfer.getData("json/Missile") ||
          event.dataTransfer.getData("json/Ballistic") ||
          event.dataTransfer.getData("json/AntiPersonell");
        this.inventory = this.inventory.concat(JSON.parse(item));
        event.stopPropagation();
      }, false);
      this.inventoryElem.addEventListener("dragend", event => {
        if (this.dragging) {
          this.dragging = false;
        }
      }, false);

      this.hardpointsElem = this.shadowRoot.getElementById("hardpoints");
    }

    get inventory() {
      return this._inventory;
    }

    set inventory(inventory) {
      if (this._inventory !== inventory) {
        this._inventory = inventory;
        this.buildInventoryList();
        this.checkHardpoints();
      }
    }

    get defs() {
      return this._defs;
    }

    set defs(val) {
      this._defs = val;
    }

    get componentDef() {
      return this._componentDef;
    }

    set componentDef(val) {
      this._componentDef = val;
    }


    buildInventoryList() {
      this.inventoryElem.items = this.inventory;
    }

    checkHardpoints() {
      const hardpoints = [];
      const assignedHardpoints = {
        Energy: {max: 0, equipped: 0},
        Missile: {max: 0, equipped: 0},
        Ballistic: {max: 0, equipped: 0},
        AntiPersonell: {max: 0, equipped: 0},
      };
      if (this.componentDef.Hardpoints) {
        for (const hardpoint of this.componentDef.Hardpoints) {
          assignedHardpoints[hardpoint.WeaponMount].max ++;
        }
      }
      for (const item of this.inventory) {
        if (item.def.Category) {
          assignedHardpoints[item.def.Category].equipped ++;
        }
      }
      for (const key of Object.keys(assignedHardpoints)) {
        const item = assignedHardpoints[key];
        if (item.max || item.equipped) {
          if (item.equipped > item.max) {
            this.hardpointsElem.classList.add("warning");
          }
          else {
            this.hardpointsElem.classList.remove("warning");
          }
          hardpoints.push(`${key}: ${item.equipped}/${item.max}`);
        }
      }
      this.hardpointsElem.text = `Hardpoints: ${hardpoints.join(" & ")}`;
    }
  });
})();
