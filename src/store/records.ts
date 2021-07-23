import { selector, selectorFamily } from "recoil";
import { bookmarkSelector } from "./bookmark";

export const recordsSelector = selector<Aha.RecordUnion[]>({
  key: "recordsSelector",
  get: async ({ get }) => {
    const bookmark = get(bookmarkSelector);
    if (!bookmark) return [];

    return bookmark.records.filter(
      (record) => record.assignedToUser.id === (window as any).currentUser.id
    );
  },
});

export const recordSelector = selectorFamily<Aha.RecordUnion | undefined, string>({
  key: "recordSelector",
  get:
    (id) =>
    ({ get }) =>
      get(recordsSelector).find((r) => r.id === id),
});
