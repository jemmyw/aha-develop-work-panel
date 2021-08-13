import React from "react";
import { useRecoilCachedLoadable } from "../../lib/useRecoilCachedLoadable";
import { PrInfo } from "../../PrInfo";
import { githubPullRequestSelector, Labels } from "../../store/github";
import { mapStatusCheck } from "../../store/helpers/mapStatusCheck";
import { ReviewDecision } from "./ReviewDecision";
import { StatusCheck } from "./StatusCheck";
import Color from "color";

const PrState: React.FC<{ state: PrInfo["state"] }> = ({ state }) => {
  return (
    <div className={"i-p pr-s " + state.toLowerCase()}>
      {state.toUpperCase()}
    </div>
  );
};

const Labels: React.FC<{ labels: Labels }> = ({ labels }) => {
  const labelEls = labels.nodes.map((label, i) => {
    const color = Color("#" + label.color);

    return (
      <div
        className="pr-label"
        style={{
          backgroundColor: color.hex(),
          color: color.isDark() ? "white" : "black",
        }}
        key={i}
      >
        {label.name}
      </div>
    );
  });

  return <div className="i-p pr-l">{labelEls}</div>;
};

const PullRequestInfo: React.FC<{ prInfo: PrInfo }> = ({ prInfo }) => {
  const [fullPrInfo, state] = useRecoilCachedLoadable(
    githubPullRequestSelector(prInfo.url),
    null
  );

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
      {fullPrInfo.reviewDecision && (
        <ReviewDecision reviewDecision={fullPrInfo.reviewDecision} />
      )}
      {fullPrInfo.labels && <Labels labels={fullPrInfo.labels} />}
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
