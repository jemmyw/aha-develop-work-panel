import { atom, atomFamily, selectorFamily } from "recoil";

export const recordsState = atom<Aha.RecordUnion[]>({
  key: "recordsState",
  default: [],
});

export const recordState = selectorFamily<Aha.RecordUnion | undefined, string>({
  key: "recordState",
  get:
    (id) =>
    ({ get }) =>
      get(recordsState).find((r) => r.id === id),
});
