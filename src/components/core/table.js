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
      }
    }

    get filter() {
      return this._filter;
    }

    set filter(val) {
      if (val !== this._filter) {
        if (this._filter !== null && typeof this._filter !== "function") {
          throw new TypeError();
        }
        this._filter = val;
        this.updateDisplayItems();
      }
      this.buildBody();
    }

    get items () {
      return this._items;
    }

    set items (val) {
      if (val !== this._items) {
        this._items = val;
      }
    }
  });
})();
