import Color from "color";
import React from "react";
import { Record } from "./Record";

interface Props {
  workflowStatus: Aha.WorkflowStatus;
  records: Array<Aha.RecordUnion>;
}

export const WorkflowStatus: React.FC<Props> = ({
  workflowStatus,
  records,
}) => {
  const color = Color(workflowStatus.color);
  const fore = color.isDark() ? "#fff" : "#000";
  const back = color.mix(Color.rgb(255, 255, 255), 0.6);

  const recordElements = records.map((record) => (
    <Record record={record} key={record.id} />
  ));

  return (
    <div className="workflow-status">
      <div
        className="title"
        style={{ backgroundColor: color.hex(), color: fore }}
      >
        <span className="name">{workflowStatus.name}</span>
        <span className="record-count">{records.length}</span>
      </div>
      <div className="record-list" style={{ backgroundColor: back.hex() }}>
        <aha-flex direction="column">{recordElements}</aha-flex>
      </div>
    </div>
  );
};
