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
            let cellData = item;
            for (const property of column.key.split(".")) {
              cellData = cellData[property];
            }
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
