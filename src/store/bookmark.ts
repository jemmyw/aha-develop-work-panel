import { atom, selector } from "recoil";

export const githubExtensionFieldScope = aha.models.ExtensionField.select(
  "name",
  "value"
).where({
  extensionIdentifier: "aha-develop.github",
});

export const reactiveReloadId = atom<number>({
  key: "reactiveReloadId",
  default: 0,
});

export const teamIdState = atom<string>({
  key: "teamId",
  default: "",
});

export const projectSelector = selector({
  key: "project",
  get: async ({ get }) => {
    const selectedTeamId = get(teamIdState) || "";
    const teamId = // @ts-ignore
      selectedTeamId === "" ? window.currentProject.id : selectedTeamId;

    return await aha.models.Project.select("id", "name", "isTeam")
      .merge({ workflowBoardBookmark: ["id", "view"] })
      .find(teamId);
  },
});

export const bookmarkSelector = selector({
  key: "bookmark",
  get: async ({ get }) => {
    // Trigger when the reactive reload id changes
    get(reactiveReloadId);
    const project = get(projectSelector);
    if (!project?.isTeam) return null;

    const setupBookmark = project.workflowBoardBookmark;
    if (setupBookmark.view !== "my_work") {
      setupBookmark.view = "my_work";
      await setupBookmark.save();
    }

    const scopes = (
      aha.models.BookmarksWorkflowBoard as any
    ).OBJECT_CLASSES.map((objectClass: any) =>
      (aha.models.BookmarksWorkflowBoard as any)
        .buildRecordScope(objectClass)
        .merge({
          originalEstimate: ["text"],
          extensionFields: githubExtensionFieldScope,
        })
    )
      .reduce((acc: Aha.Query<any, any>, scope: Aha.Query<any, any>) =>
        acc.union(scope)
      )
      .where({ active: true }) as Aha.Query<any, any>;

    const bookmarkScope = aha.models.BookmarksWorkflowBoard.select(
      "id",
      "projectId",
      "workflowId",
      "view",
      "filters"
    ).merge({
      iteration: ["id", "name"],
      records: scopes,
      workflow: aha.models.Workflow.select("id", "name").merge({
        workflowStatuses: ["id", "name", "color", "position"],
      }),
    });

    const bookmark = await bookmarkScope.find(setupBookmark.id);
    return bookmark;
  },
});

export const workflowSelector = selector({
  key: "workflow",
  get: async ({ get }) => {
    const bookmark = get(bookmarkSelector);
    if (!bookmark) return null;
    return new aha.models.Workflow(
      bookmark.attributes.workflow
    ) as Aha.Workflow;
  },
});
