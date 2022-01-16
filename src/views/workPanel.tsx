import React, { useRef } from "react";
import {
  useRecoilCallback,
  useRecoilRefresher_UNSTABLE,
  useRecoilValue,
  useRecoilValueLoadable,
} from "recoil";
import { PropsToState } from "../components/PropsToState";
import { Spinner } from "../components/Spinner";
import { WorkflowStatus } from "../components/WorkflowStatus";
import { IDENTIFER } from "../identifier";
import { useCreateRefreshButton } from "../lib/useCreateRefreshButton";
import { useReactiveRegister } from "../lib/useReactiveRegister";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import {
  bookmarkSelector,
  projectSelector,
  workflowSelector,
} from "../store/bookmark";
import { authStateSelector, forceAuthState } from "../store/github";
import { recordsLoadingSelector, recordsSelector } from "../store/records";
import { Styles } from "./Styles";

const panel = aha.getPanel(IDENTIFER, "workPanel", { name: "My Work" });

interface Props {
  visibleStatuses: string[];
}

const MyWork: React.FC<Props> = ({ visibleStatuses }) => {
  const githubAuthState = useRecoilValueLoadable(authStateSelector);
  const [project] = useRecoilCachedLoadable(projectSelector, null);
  const [bookmark] = useRecoilCachedLoadable(bookmarkSelector, null);
  const [workflow] = useRecoilCachedLoadable(workflowSelector, null);
  const [records] = useRecoilCachedLoadable(recordsSelector, []);
  const refresh = useRecoilRefresher_UNSTABLE(recordsSelector);
  const recordsLoading = useRecoilValue(recordsLoadingSelector);
  const ref = useRef<HTMLDivElement>(null);

  const authorizeGithub = useRecoilCallback(
    ({ set }) =>
      () =>
        set(forceAuthState, true)
  );

  const reactiveReloadTimer = useRef<number>();
  useReactiveRegister(
    records.map(({ id, typename }) => `${typename}-${id}`),
    () => {
      if (reactiveReloadTimer.current) return;
      reactiveReloadTimer.current = setTimeout(() => {
        refresh();
        reactiveReloadTimer.current = undefined;
      }, 250);
    }
  );

  useCreateRefreshButton(ref.current, recordsLoading, () => refresh());

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
      <div className="my-work" ref={ref}>
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
  const visibleStatuses = String(panel.settings.visibleStatuses || "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const githubLabels = ["true", true].includes(
    panel.settings.githubLabels as any
  );
  const teamId = String(panel.settings.teamId || "");

  return (
    <>
      <Styles />
      <PropsToState githubLabels={githubLabels} teamId={teamId}>
        <React.Suspense fallback={<Spinner />}>
          <MyWork visibleStatuses={visibleStatuses} />
        </React.Suspense>
      </PropsToState>
    </>
  );
});

panel.on({ action: "settings" }, () => {
  return [
    {
      key: "teamId",
      type: "Select",
      title: "Team",
      options: async () => {
        const projects = await aha.models.Project.select("id", "name", "isTeam")
          .where({ teams: true })
          .all();

        return [
          { text: "Currently selected", value: "0" },
          ...projects.map((p) => ({ text: p.name, value: p.id })),
        ];
      },
    },
    {
      key: "visibleStatuses",
      type: "Text",
      title: "Visible statuses (comma separated)",
    },
    {
      key: "githubLabels",
      type: "Checkbox",
      title: "Show GitHub labels",
    },
  ] as Aha.PanelSetting[];
});
