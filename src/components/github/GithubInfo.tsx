import React from "react";
import { useRecoilCachedLoadable } from "../../lib/useRecoilCachedLoadable";
import { PrInfo } from "../../PrInfo";
import { githubPullRequestSelector } from "../../store/github";
import { mapStatusCheck } from "../../store/helpers/mapStatusCheck";
import { ReviewDecision } from "./ReviewDecision";
import { StatusCheck } from "./StatusCheck";

const PrState: React.FC<{ state: PrInfo["state"] }> = ({ state }) => {
  return (
    <div className={"i-p pr-s " + state.toLowerCase()}>
      {state.toUpperCase()}
    </div>
  );
};

const PullRequestInfo: React.FC<{ prInfo: PrInfo }> = ({ prInfo }) => {
  const [fullPrInfo, state] = useRecoilCachedLoadable(githubPullRequestSelector(prInfo.url), null);

  if (!fullPrInfo) {
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
  }

  const check = mapStatusCheck(fullPrInfo);

  return (
    <>
      <div className={"i-p pr-n " + fullPrInfo.state.toLowerCase()}>
        <a href={aha.sanitizeUrl(prInfo.url)} target="_blank">
          #{prInfo.id}
        </a>
      </div>
      <PrState state={fullPrInfo.state} />
      {check && <StatusCheck check={check} />}
      <ReviewDecision reviewDecision={fullPrInfo.reviewDecision} />
    </>
  );
};

export const GithubInfo: React.FC<{ fields: Aha.ExtensionField[] }> = ({
  fields,
}) => {
  const prs = fields
    .filter((f) => f.name === "pullRequests")
    .flatMap((prFields) =>
      prFields.value.map((prInfo: PrInfo) => (
        <PullRequestInfo prInfo={prInfo} />
      ))
    );

  return <>{prs}</>;
};
