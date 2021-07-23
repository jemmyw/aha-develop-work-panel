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
          <aha-icon icon="fa fa-comment" />
          {record.commentsCount}
        </div>
        <GithubInfo fields={record.extensionFields} />
      </div>
    </div>
  );
};
