import React from "react";
import { StatusCheckRollup } from "../../store/github";

const checkStyle = (status: StatusCheckRollup["state"]) => {
  switch (status) {
    case "ERROR":
      return { color: "red", icon: "fa-exclamation-triangle" };
    case "EXPECTED":
      return { color: "yellow", icon: "fa-clock" };
    case "FAILURE":
      return { color: "red", icon: "fa-times-circle" };
    case "PENDING":
      return { color: "yellow", icon: "fa-clock" };
    case "SUCCESS":
      return { color: "green", icon: "fa-check-circle" };
  }
};
export const StatusCheck: React.FC<{ check: StatusCheckRollup }> = ({
  check,
}) => {
  const style = checkStyle(check.state);

  return (
    <div
      className={"i-p pr-c " + check.state.toLowerCase()}
      style={{ color: style.color }}
    >
      <aha-icon icon={"fa-regular " + style.icon} />
    </div>
  );
};
