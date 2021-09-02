import Color from "color";
import React from "react";
import { PrInfo } from "../PrInfo";
import { GetPRPullRequest } from "../store/github";
import { mapStatusCheck } from "../store/helpers/mapStatusCheck";
import { GithubInfo } from "./github/GithubInfo";
import { ReviewDecision } from "./github/ReviewDecision";
import { StatusCheck } from "./github/StatusCheck";

interface Props {
  requirement: Aha.Requirement;
}

export const Requirement: React.FC<Props> = ({ requirement }) => {
  const color = Color(requirement.teamWorkflowStatus.color).mix(
    Color.rgb(255, 255, 255),
    0.0
  );

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    aha.drawer.showRecord(requirement);
  };

  return (
    <div className="requirement">
      <div className="requirement-status" style={{ color: color.hex() }}>
        <i className="fa-solid fa-circle"></i>
      </div>
      <div className="requirement-ref">
        <a href={requirement.path} onClick={onClick}>
          {requirement.referenceNum}
        </a>
      </div>
      <div className="requirement-name">
        <a href={requirement.path} onClick={onClick}>
          {requirement.name}
        </a>
      </div>
      <div className="requirement-github">
        <GithubInfo
          fields={requirement.extensionFields}
          PartialComponent={PartialPullRequestInfo}
          FullComponent={FullPullRequestInfo}
        />
      </div>
    </div>
  );
};

const PartialPullRequestInfo: React.FC<{ prInfo: PrInfo }> = ({ prInfo }) => {
  return (
    <div className={"i-p pr-s " + prInfo.state.toLowerCase()}>
      <a href={aha.sanitizeUrl(prInfo.url)} target="_blank">
        #{prInfo.id}
      </a>
    </div>
  );
};

const FullPullRequestInfo: React.FC<{ prInfo: GetPRPullRequest }> = ({
  prInfo,
}) => {
  const check = mapStatusCheck(prInfo);

  return (
    <>
      <div className={"i-p pr-s " + prInfo.state.toLowerCase()}>
        <a href={aha.sanitizeUrl(prInfo.url)} target="_blank">
          #{prInfo.number}
        </a>
      </div>
      {check && <StatusCheck check={check} />}
      {prInfo.reviewDecision && (
        <ReviewDecision reviewDecision={prInfo.reviewDecision} />
      )}
    </>
  );
};
