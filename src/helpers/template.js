export const create = html => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template;
};

export const clone = tag => {
  const clone = document.createElement("template");
  clone.content.appendChild(document.importNode(customElements.get(tag).template.content, true));
  return clone;
};

export const append = (template, html) => {
  const content = document.createElement("template");
  content.innerHTML = html;
  template.content.appendChild(content.content);
};
