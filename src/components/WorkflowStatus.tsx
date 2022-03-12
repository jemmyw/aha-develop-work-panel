import Color from "color";
import React from "react";
import { useRecoilValue } from "recoil";
import { themeState } from "../store/theme";
import { Record } from "./Record";

interface Props {
  workflowStatus: Aha.WorkflowStatus;
  records: Array<Aha.RecordUnion>;
}

export const WorkflowStatus: React.FC<Props> = ({
  workflowStatus,
  records,
}) => {
  const theme = useRecoilValue(themeState);
  const color = Color(workflowStatus.color);
  const mix =
    theme === "dark" ? Color.rgb(50, 50, 50) : Color.rgb(255, 255, 255);
  const back = color.mix(mix, 0.4);
  const fore = back.isDark() ? "#fff" : "#000";
  const listBack = color.mix(mix, 0.6);

  const recordElements = records.map((record) => (
    <Record record={record} key={record.id} />
  ));

  return (
    <div className="workflow-status">
      <div
        className="title"
        style={{ backgroundColor: back.hex(), color: fore }}
      >
        <span className="name">{workflowStatus.name}</span>
        <span className="record-count">{records.length}</span>
      </div>
      <div className="record-list" style={{ backgroundColor: listBack.hex() }}>
        <aha-flex direction="column">{recordElements}</aha-flex>
      </div>
    </div>
  );
};
