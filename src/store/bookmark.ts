import { atom, selector } from "recoil";

export const workflowBoardIdState = atom<string | null>({
  key: "workflowBoardId",
  default: null,
});

export const reactiveReloadId = atom<number>({
  key: "reactiveReloadId",
  default: 0,
});

export const bookmarkSelector = selector({
  key: "bookmark",
  get: async ({ get }) => {
    const id = get(workflowBoardIdState);
    if (!id) return null;

    // Trigger when the reactive reload id changes
    get(reactiveReloadId);

    const scopes = (
      aha.models.BookmarksWorkflowBoard as any
    ).OBJECT_CLASSES.map((objectClass: any) =>
      (aha.models.BookmarksWorkflowBoard as any)
        .buildRecordScope(objectClass)
        .merge({
          originalEstimate: ["text"],
          extensionFields: aha.models.ExtensionField.select(
            "name",
            "value"
          ).where({
            extensionIdentifier: "aha-develop.github",
          }),
        })
    ).reduce((acc: Aha.Query<any, any>, scope: Aha.Query<any, any>) =>
      acc.union(scope)
    ) as Aha.Query<any, any>;

    const bookmarkScope = aha.models.BookmarksWorkflowBoard.select(
      "id",
      "projectId",
      "workflowId",
      "view",
      "filters"
    ).merge({
      iteration: ["id", "name"],
      records: scopes,
    });

    return await bookmarkScope.find(id);
  },
});

export const workflowSelector = selector({
  key: "workflow",
  get: async ({ get }) => {
    const bookmark = get(bookmarkSelector);
    if (!bookmark) return null;

    return await aha.models.Workflow.select("id", "name")
      .merge({ workflowStatuses: ["id", "name", "color", "position"] })
      .find(bookmark.workflowId);
  },
});
