export const create = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template;
};

export const clone = tag => {
  const clone = document.createElement("template");
  const node = document.importNode(customElements.get(tag).template.content, true);
  clone.content.appendChild(node);
  return clone;
};

export const append = (template, html) => {
  const content = document.createElement("template");
  content.innerHTML = html;
  template.content.appendChild(content.content);
};
