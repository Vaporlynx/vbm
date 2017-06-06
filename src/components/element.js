(() => {
  customElements.define("vpl-element", class extends HTMLElement {
    static get template() {
      return null;
    }

    constructor() {
      super();

      this.initialized = false;

      this.attachShadow({mode: "open"}).appendChild(document.importNode(this.constructor.template.content, true));
    }

    initializedCallback() {
      this.initialized = true;
    }

    connectedCallback() {
      if (!this.initialized) {
        this.initializedCallback();
      }
    }
  });
})();
