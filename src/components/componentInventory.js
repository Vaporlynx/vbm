import * as templateHelper from "../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
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
        // handleDrop: event => {
        //   this.inventory = this.inventory.concat(JSON.parse(event.dataTransfer.getData("text/plain")));
        //   event.stopPropagation();
        // },
        // handleDragEnter: event => {
        //   if (!this.dragging) {
        //     event.preventDefault();
        //     event.dataTransfer.dropEffect = "move";
        //   }
        // },
        // handleDragOver: event => {
        //   if (!this.dragging) {
        //     event.preventDefault();
        //   }
        // },
        handleDragEnd: (event, oldIndex) => {
          if (event.dataTransfer.dropEffect === "move") {
            this.inventory = this.inventory.filter((item, index) => index !== oldIndex);
          }
        },
      }];
      this.inventoryElem.addEventListener("dragover", event => {
        console.log("dragover");
        if (!this.dragging) {
          event.preventDefault();
        }
      }, false);
      this.inventoryElem.addEventListener("dragenter", event => {
        console.log("dragenter");
        if (!this.dragging) {
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
        }
      }, false);
      this.inventoryElem.addEventListener("drop", event => {
        console.log("drop");
        this.inventory = this.inventory.concat(JSON.parse(event.dataTransfer.getData("text/plain")));
        event.stopPropagation();
      }, false);
      this.inventoryElem.addEventListener("dragend", event => {
        if (this.dragging) {
          this.dragging = false;
        }
      }, false);
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
