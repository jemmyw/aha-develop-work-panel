import React, { useEffect } from "react";
import {
  RecoilRoot,
  useRecoilCallback, useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState
} from "recoil";
import { IDENTIFER } from "../identifier";
import {
  bookmarkSelector,
  workflowBoardIdState,
  workflowSelector
} from "../store/bookmark";
import { authStateSelector, forceAuthState } from "../store/github";
import { recordsSelector } from "../store/records";
import { Styles } from "./Styles";
import { WorkflowStatus } from "./WorkflowStatus";

const panel = aha.getPanel(IDENTIFER, "workPanel", { name: "My Work" });

interface Props {
  workflowBoardId: string;
  visibleStatuses: string[];
}

const MyWork: React.FC<Props> = ({ workflowBoardId, visibleStatuses }) => {
  const githubAuthState = useRecoilValueLoadable(authStateSelector);
  const setWorkflowBoardId = useSetRecoilState(workflowBoardIdState);
  const bookmark = useRecoilValue(bookmarkSelector);
  const workflow = useRecoilValue(workflowSelector);
  const records = useRecoilValue(recordsSelector);

  const authorizeGithub = useRecoilCallback(
    ({ set }) =>
      () =>
        set(forceAuthState, true)
  );

  useEffect(() => {
    setWorkflowBoardId(workflowBoardId);
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
    <>
      <div className="my-work">
        <div className="workflow-statuses">
          <aha-flex direction="column">{statuses}</aha-flex>
        </div>
      </div>
      {githubAuthState.contents === "unknown" && (
        <div className="github-auth">
          <aha-button type="primary" onClick={authorizeGithub}>
            Authorize GitHub
          </aha-button>
        </div>
      )}
    </>
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
        <React.Suspense fallback={<aha-spinner />}>
          <MyWork
            workflowBoardId={String(panel.settings.workflowBoardId)}
            visibleStatuses={visibleStatuses}
          />
        </React.Suspense>
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
