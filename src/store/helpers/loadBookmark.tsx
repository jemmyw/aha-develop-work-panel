export async function loadBookmark(id: string) {
  const scopes = (aha.models.BookmarksWorkflowBoard as any).OBJECT_CLASSES.map(
    (objectClass: any) =>
      (aha.models.BookmarksWorkflowBoard as any)
        .buildRecordScope(objectClass)
        .merge({
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

  const bookmark = await bookmarkScope.find(id);
  const workflow = await aha.models.Workflow.select("id", "name")
    .merge({ workflowStatuses: ["id", "name", "color", "position"] })
    .find(bookmark.workflowId);
  const records = bookmark.records.filter(
    (record) => record.assignedToUser.id === (window as any).currentUser.id
  );
  return { workflow, bookmark, records };
}
