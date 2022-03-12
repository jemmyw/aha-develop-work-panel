import { atom } from "recoil";

export const themeState = atom<'dark'|'light'>({
  key: "theme",
  default: window.themeStore.theme === "dark" ? "dark" : "light",
});
