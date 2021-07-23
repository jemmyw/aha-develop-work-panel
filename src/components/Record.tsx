import React from "react";
import { GithubInfo } from "./github/GithubInfo";

export const Record: React.FC<{
  workflowStatus: Aha.WorkflowStatus;
  record: Aha.RecordUnion;
}> = ({ record }) => {
  const onClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    aha.drawer.showRecord(record);
  };

  return (
    <div className="record">
      <div className="ref">{record.referenceNum}</div>
      <div className="name">
        <a href="#" onClick={onClick}>
          {record.name}
        </a>
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
    </div>
  );
};
