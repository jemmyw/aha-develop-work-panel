import React, { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import { IDENTIFER } from "../identifier";
import { Styles } from "./Styles";
import { WorkflowStatus } from "./WorkflowStatus";

const panel = aha.getPanel(IDENTIFER, "workPanel", { name: "My Work" });

interface Props {
  workflowBoardId: string;
  visibleStatuses: string[];
}

const MyWork: React.FC<Props> = ({ workflowBoardId, visibleStatuses }) => {
  const [bookmark, setBookmark] = useState<Aha.BookmarksWorkflowBoard | null>(
    null
  );
  const [workflow, setWorkflow] = useState<Aha.Workflow | null>(null);
  const [records, setRecords] = useState<Aha.RecordUnion[]>([]);

  useEffect(() => {
    async function loadBookmark(id: string) {
      const scopes = (
        aha.models.BookmarksWorkflowBoard as any
      ).OBJECT_CLASSES.map((objectClass: any) =>
        (aha.models.BookmarksWorkflowBoard as any).buildRecordScope(objectClass)
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

      setWorkflow(workflow);
      setBookmark(bookmark);

      const records = bookmark.records.filter(
        (record) => record.assignedToUser.id === window.currentUser.id
      );
      setRecords(records);
    }

    if (!workflowBoardId) return;
    loadBookmark(workflowBoardId);
  }, [workflowBoardId]);

  if (!workflowBoardId) return <div>Edit the panel settings first</div>;
  if (!bookmark || !workflow) return <aha-spinner />;

  const statuses = workflow.workflowStatuses.reduce((acc, status) => {
    if (visibleStatuses.length > 0 && !visibleStatuses.includes(status.name))
      return acc;

    const statusRecords = records.filter(
      (r) => r.teamWorkflowStatus.id === status.id
    );
    if (statusRecords.length === 0) return acc;

    return [
      ...acc,
      <WorkflowStatus
        workflowStatus={status}
        key={status.id}
        records={statusRecords}
      />,
    ];
  }, [] as JSX.Element[]);

  return (
    <div>
      <div className="workflow-statuses">
        <aha-flex direction="column">
          {statuses}
        </aha-flex>
      </div>
    </div>
  );
};

panel.on("render", ({ props: { panel } }) => {
  const visibleStatuses = String(panel.settings.visibleStatuses)
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  return (
    <>
      <Styles />
      <RecoilRoot>
        <MyWork
          workflowBoardId={String(panel.settings.workflowBoardId)}
          visibleStatuses={visibleStatuses}
        />
      </RecoilRoot>
    </>
  );
});

panel.on({ action: "settings" }, () => {
  return [
    {
      key: "workflowBoardId",
      type: "Text",
      title: "Workflow board ID",
    },
    {
      key: "visibleStatuses",
      type: "Text",
      title: "Visible statuses (comma separated)",
    },
  ] as Aha.PanelSetting[];
});
