import { useEffect } from "react";
import { getParentMatching } from "./getParentElement";

export function useCreateRefreshButton(
  panel: HTMLDivElement | null,
  loading: boolean,
  callback: () => void) {
  useEffect(() => {
    if (!panel)
      return;

    const parentPanel = getParentMatching(panel, (parent) => parent.className.includes("Panel--")
    );
    if (!parentPanel)
      return;

    const bounds = jQuery(parentPanel).offset();
    if (!bounds)
      return;

    const container = document.createElement("div");
    container.style.position = "absolute";

    const btn = document.createElement("aha-button");
    btn.setAttribute("type", "unstyled");

    const icon = document.createElement("i");
    icon.className = "fa-regular fa-sync";
    icon.style.color = "var(--aha-gray-600)";

    if (loading) {
      icon.classList.add("fa-spin");
      btn.setAttribute("disabled", "disabled");
    }

    btn.appendChild(icon);
    container.appendChild(btn);

    const onClick = () => callback();

    document.body.appendChild(container);
    container.style.top = bounds.top + 3 + "px";
    container.style.left = bounds.left + parentPanel.clientWidth - 66 + "px";
    btn.addEventListener("click", onClick);

    return () => {
      btn.removeEventListener("click", onClick);
      container.remove();
    };
  }, [panel, loading, callback]);
}
