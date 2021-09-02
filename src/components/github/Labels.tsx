import React from "react";
import { Labels as LabelsType } from "../../store/github";
import Color from "color";

export const Labels: React.FC<{ labels: LabelsType }> = ({ labels }) => {
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
