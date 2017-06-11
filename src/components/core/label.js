import * as templateHelper from "../../helpers/template.js";

(() => {
  const template = templateHelper.create(`
    <style>
      display: flex;
      flex-direction: row;
    </style>

    <div id="prefix"></div>
    <div id="text"></div>
  `);

  customElements.define("vpl-label", class extends customElements.get("vpl-element") {
    static get template() {
      return template;
    }

    static get observedAttributes() {
      return ["prefix", "text"];
    }

    constructor() {
      super();

      this._prefix = "";
      this._text = "";

      this.prefixElem = this.shadowRoot.getElementById("prefix");
      this.textElem = this.shadowRoot.getElementById("text");
    }

    get prefix() {
      return this._prefix;
    }

    set prefix(val) {
      if (val !== "") {
        this._prefix = val;
        this.setAttribute("prefix", val);
        this.prefixElem.innerHTML = this._prefix;
      }
      else {
        this.checkHidden();
      }
    }

    get text() {
      return this._text;
    }

    set text(val) {
      if (val !== "") {
        this._text = val;
        this.setAttribute("text", val);
        this.textElem.innerHTML = this._text;
        this.style.display = "flex";
      }
      else {
        this.checkHidden();
      }
    }

    checkHidden() {
      if (this.prefixElem.text === this.textElem.text === "") {
        this.style.display = "none";
      }
    }
  });
})();
