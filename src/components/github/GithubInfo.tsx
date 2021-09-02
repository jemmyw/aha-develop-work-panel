import React from "react";
import { useRecoilCachedLoadable } from "../../lib/useRecoilCachedLoadable";
import { PrInfo } from "../../PrInfo";
import {
  GetPRPullRequest,
  githubPullRequestSelector
} from "../../store/github";
import { mapStatusCheck } from "../../store/helpers/mapStatusCheck";
import { Labels } from "./Labels";
import { ReviewDecision } from "./ReviewDecision";
import { StatusCheck } from "./StatusCheck";

const PrState: React.FC<{ state: PrInfo["state"] }> = ({ state }) => {
  return (
    <div className={"i-p pr-s " + state.toLowerCase()}>
      {state.toUpperCase()}
    </div>
  );
};

const PartialPullRequestInfo: React.FC<{ prInfo: PrInfo }> = ({ prInfo }) => {
  return (
    <>
      <div className={"i-p pr-n " + prInfo.state.toLowerCase()}>
        <a href={aha.sanitizeUrl(prInfo.url)} target="_blank">
          #{prInfo.id}
        </a>
      </div>
      <PrState state={prInfo.state} />
    </>
  );
};

const FullPullRequestInfo: React.FC<{ prInfo: GetPRPullRequest }> = ({
  prInfo,
}) => {
  const check = mapStatusCheck(prInfo);

  return (
    <>
      <div className={"i-p pr-n " + prInfo.state.toLowerCase()}>
        <a href={aha.sanitizeUrl(prInfo.url)} target="_blank">
          #{prInfo.number}
        </a>
      </div>
      <PrState state={prInfo.state} />
      {check && <StatusCheck check={check} />}
      {prInfo.reviewDecision && (
        <ReviewDecision reviewDecision={prInfo.reviewDecision} />
      )}
      {prInfo.labels && <Labels labels={prInfo.labels} />}
    </>
  );
};

const PullRequestInfo: React.FC<{
  prInfo: PrInfo;
  FullComponent: React.ComponentType<{ prInfo: GetPRPullRequest }>;
  PartialComponent: React.ComponentType<{ prInfo: PrInfo }>;
}> = ({ prInfo, FullComponent, PartialComponent }) => {
  const [fullPrInfo, state] = useRecoilCachedLoadable(
    githubPullRequestSelector(prInfo.url),
    null
  );

  if (fullPrInfo) {
    return <FullComponent prInfo={fullPrInfo} />;
  }

  return <PartialComponent prInfo={prInfo} />;
};

export const GithubInfo: React.FC<{
  fields: Aha.ExtensionField[];
  FullComponent?: React.ComponentType<{ prInfo: GetPRPullRequest }>;
  PartialComponent?: React.ComponentType<{ prInfo: PrInfo }>;
}> = ({
  fields,
  FullComponent = FullPullRequestInfo,
  PartialComponent = PartialPullRequestInfo,
}) => {
  const prs = fields
    .filter((f) => f.name === "pullRequests")
    .flatMap((prFields) =>
      prFields.value.map((prInfo: PrInfo) => (
        <PullRequestInfo
          prInfo={prInfo}
          FullComponent={FullComponent}
          PartialComponent={PartialComponent}
        />
      ))
    );

  return <>{prs}</>;
};
