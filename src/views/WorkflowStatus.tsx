import Color from "color";
import React from "react";
import { Record } from "../components/Record";

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

  const recordElements = records.map((record) => (
    <Record workflowStatus={workflowStatus} record={record} key={record.id} />
  ));

  return (
    <div className="workflow-status">
      <div
        className="name"
        style={{ backgroundColor: color.hex(), color: fore }}
      >
        {workflowStatus.name}
      </div>
      <div className="records">
        <aha-flex direction="column">{recordElements}</aha-flex>
      </div>
    </div>
  );
};
