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
      this._componentTemplate = {
        ComponentDefID: "",
        ComponentDefType: "",
        MountedLocation: "",
        HardpointSlot: -1,
        DamageLevel: "Functional",
        prefabName: null,
        hasPrefabName: false,
      };

      this.dragging = false;

      this.inventoryElem = this.shadowRoot.getElementById("inventory");
      this.inventoryElem.columns = [{
        key: "def.Description.Name",
        handleDragStart: (event, dragData) => {
          // TODO: set the data type to the weapon hardpoint type so we can follow construction rules
          event.dataTransfer.effectAllowed = "copyMove";
          event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
          this.dragging = true;
        },
        handleDrop: event => {
          this.inventory = this.inventory.concat(JSON.parse(event.dataTransfer.getData("text/plain")));
          event.stopPropagation();
        },
        handleDragEnter: event => {
          if (!this.dragging) {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
          }
        },
        handleDragOver: event => {
          if (!this.dragging) {
            event.preventDefault();
          }
        },
        handleDragEnd: (event, oldIndex) => {
          if (event.dataTransfer.dropEffect === "move") {
            this.inventory = this.inventory.filter((item, index) => index !== oldIndex);
          }
        },
      }];
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

    get defs() {
      return this._defs;
    }

    set defs(val) {
      this._defs = val;
    }

    buildInventoryList() {
      this.inventoryElem.items = this.inventory;
    }
  });
})();
