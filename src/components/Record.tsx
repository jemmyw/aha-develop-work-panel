import Color from "color";
import React, { useMemo, useState } from "react";
import { useRecoilCachedLoadable } from "../lib/useRecoilCachedLoadable";
import { featureRequirements } from "../store/requirements";
import { GithubInfo } from "./github/GithubInfo";
import { Requirement } from "./Requirement";

export const Record: React.FC<{
  record: Aha.RecordUnion;
}> = ({ record }) => {
  const [reqs] = useRecoilCachedLoadable(featureRequirements(record.id), []);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    aha.drawer.showRecord(record);
  };

  const requirementElements = useMemo(
    () =>
      reqs &&
      reqs.map((req) => (
        <Requirement key={`child-${req.id}`} requirement={req} />
      )),
    [reqs]
  );

  let color = null;
  if (record.teamWorkflowStatus?.color) {
    color = Color(record.teamWorkflowStatus.color).mix(
      Color.rgb(255, 255, 255),
      0.6
    );
  }

  return (
    <div
      className="record"
      style={
        color
          ? {
              borderLeft: `5px solid ${color.hex()}`,
            }
          : {}
      }
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div className="ref">
            <a href="#" onClick={onClick}>
              {record.referenceNum}
            </a>
          </div>
          <div className="name">
            <a href="#" onClick={onClick}>
              {record.name}
            </a>
          </div>
        </div>
      </div>
      <div className="info">
        <div
          className={
            "i-p commentCount" +
            (record.commentsCount > 0 ? " hasComments" : "")
          }
        >
          <aha-icon icon="fa-regular fa-comment" />
          {record.commentsCount}
        </div>
        {record.originalEstimate?.text && (
          <div className="i-p estimate">
            <aha-icon icon="fa-regular fa-clock" />
            {record.originalEstimate.text}
          </div>
        )}
        <GithubInfo fields={record.extensionFields} />
      </div>
      {requirementElements && requirementElements.length > 0 && (
        <div className="requirements">{requirementElements}</div>
      )}
    </div>
  );
};
