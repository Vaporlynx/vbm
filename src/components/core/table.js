import * as templateHelper from "../../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      :host {
        display: flex;
        flex-direction: column;
      }
    </style>

    <table>
      <thead>
      </thead>
      <tbody>
      </tbody>
    </table>
  `);
// TODO: find out why this class is not initing properly
  customElements.define("vpl-table", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    constructor() {
      super();

      this._items = [];
      this._displayItems = [];
      this._filter = null;
      this._columns = [];
    }

    get columns() {
      return this._columns;
    }

    set columns(val) {
      if (this._columns !== val) {
        this._columns = val;
        // TODO: build out column headers
      }
    }

    get filter() {
      return this._filter;
    }

    set filter(val) {
      if (val !== this._filter) {
        if (val !== null && typeof val !== "function") {
          throw new TypeError();
        }
        this._filter = val;
      }
      this.buildTable();
    }

    get items() {
      return this._items;
    }

    set items(val) {
      if (val !== null && !Array.isArray(val)) {
        throw new TypeError();
      }
      if (val !== this._items) {
        this._items = val;
        this.buildTable();
      }
    }

    get displayItems() {
      return this._displayItems;
    }

    indexInto(object, key) {
      let data = object;
      for (const property of key.split(".")) {
        data = data[property];
      }
      return data;
    }

    buildTable() {
      const body = this.shadowRoot.querySelector("tbody");
      body.innerHTML = "";
      this._displayItems = this.filter ? this.items.fiilter(this.filter) : this.items;
      if (this.displayItems && this.displayItems.length) {
        for (const item of this.displayItems) {
          const row = document.createElement("tr");
          row.rowData = item;
          for (const column of this.columns) {
            const cell = document.createElement("td");
            if (column.handleDragStart) {
              cell.setAttribute("draggable", true);
              cell.addEventListener("dragstart", event => {
                cell.style.opacity = "0.5";
                const dragData = column.dragData ? this.indexInto(item, column.dragData) : item;
                column.handleDragStart(event, dragData);
              }, false);
            }
            cell.addEventListener("dragend", event => {
              cell.style.opacity = "1.0";
              if (column.handleDragEnd) {
                column.handleDragEnd(event);
              }
            }, false);
            cell.addEventListener("dragover", event => {
              event.stopPropagation();
              if (column.handleDragOver) {
                column.handleDragOver(event);
              }
            }, false);
            cell.addEventListener("dragenter", event => {
              event.stopPropagation();
              if (column.handleDragEnter) {
                column.handleDragEnter(event);
              }
            }, false);
            if (column.handleDrop) {
              // TODO: figure out why the fuck this doesnt work
              cell.addEventListener("drop", event => {
                column.handleDrop(event);
              }, false);
            }
            const cellData = this.indexInto(item, column.key);
            if (column.renderer) {
              cell.innerHTML = column.renderer(cellData);
            }
            else {
              cell.innerText = cellData;
            }
            row.appendChild(cell);
          }
          body.appendChild(row);
        }
      }
    }
  });
})();
