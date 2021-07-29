export const getParentElement = (el: Node): HTMLElement | null => {
  const parent = el.parentNode;
  if (!parent)
    return null;

  if (parent.nodeType === document.DOCUMENT_FRAGMENT_NODE) {
    return getParentElement((parent as ShadowRoot).host);
  }
  if (parent.nodeType === document.ELEMENT_NODE) {
    return parent as HTMLElement;
  }
  return getParentElement(parent);
};

export const getParentMatching = (
  el: Node,
  fn: (parent: HTMLElement) => boolean
): HTMLElement | null => {
  const parent = getParentElement(el);
  if (!parent)
    return null;

  if (fn(parent))
    return parent;
  return getParentMatching(parent, fn);
};
