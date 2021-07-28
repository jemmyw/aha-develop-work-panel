import React, { useEffect, useRef } from "react";
import {
  RecoilRoot,
  useRecoilCallback,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { WorkflowStatus } from "../components/WorkflowStatus";
import { IDENTIFER } from "../identifier";
import { useReactiveRegister } from "../lib/useReactiveRegister";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import {
  bookmarkSelector,
  projectSelector,
  reactiveReloadId,
  workflowBoardIdState,
  workflowSelector,
} from "../store/bookmark";
import { authStateSelector, forceAuthState } from "../store/github";
import { recordsSelector } from "../store/records";
import { Styles } from "./Styles";

const panel = aha.getPanel(IDENTIFER, "workPanel", { name: "My Work" });

interface Props {
  workflowBoardId: string;
  visibleStatuses: string[];
}

const Spinner: React.FC<{}> = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <aha-spinner size="48px" />
    </div>
  );
};

const MyWork: React.FC<Props> = ({ workflowBoardId, visibleStatuses }) => {
  const githubAuthState = useRecoilValueLoadable(authStateSelector);
  const [project] = useRecoilCachedLoadable(projectSelector, null);
  const [bookmark] = useRecoilCachedLoadable(bookmarkSelector, null);
  const [workflow] = useRecoilCachedLoadable(workflowSelector, null);
  const [records] = useRecoilCachedLoadable(recordsSelector, []);

  const authorizeGithub = useRecoilCallback(
    ({ set }) =>
      () =>
        set(forceAuthState, true)
  );

  const incrementReload = useRecoilCallback(({ set }) => () => {
    set(reactiveReloadId, (id) => id + 1);
  });

  const reactiveReloadTimer = useRef<NodeJS.Timeout>();
  useReactiveRegister(
    records.map(({ id, typename }) => `${typename}-${id}`),
    () => {
      if (reactiveReloadTimer.current) return;
      reactiveReloadTimer.current = setTimeout(() => {
        incrementReload();
        reactiveReloadTimer.current = undefined;
      }, 250);
    }
  );

  if (!project) return <Spinner />;
  if (!project.isTeam) {
    return <div>Select a team first</div>;
  }
  if (!bookmark || !workflow) return <Spinner />;

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
        <React.Suspense fallback={<Spinner />}>
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
      key: "visibleStatuses",
      type: "Text",
      title: "Visible statuses (comma separated)",
    },
  ] as Aha.PanelSetting[];
});
