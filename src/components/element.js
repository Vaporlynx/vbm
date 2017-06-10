(() => {
  customElements.define("vpl-element", class extends HTMLElement {
    static get template() {
      return null;
    }

    constructor() {
      super();
      const node = document.importNode(this.constructor.template.content, true);
      this.attachShadow({mode: "open"}).appendChild(node);
    }
  });
})();
