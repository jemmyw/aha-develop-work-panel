import React from "react";

function css(literals: TemplateStringsArray) {
  const values = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    values[_i - 1] = arguments[_i];
  }
  let output = "";
  let index;
  for (index = 0; index < values.length; index++) {
    output += literals[index] + values[index];
  }
  output += literals[index];
  return output;
}

export const Styles = () => {
  return (
    <style>
      {css`
        .workflow-status > .name {
          padding: 3px 8px;
          font-size: 14px;
        }

        .record .ref {
          font-size: 11px;
          padding: 4px 6px;
        }

        .record .name {
          padding: 4px 6px;
        }

        .record {
          padding: 0;
          border-bottom: 1px solid var(--aha-gray-400);
        }

        .record .info {
          display: flex;
          color: var(--aha-gray-800);
          font-size: 10px;
        }

        .record .info aha-icon {
          font-size: 11px;
          margin-right: 3px;
        }

        .record .info > div {
          border-right: 1px solid var(--aha-gray-200);
        }

        .record .commentCount {
          color: var(--aha-gray-400);
        }
        .record .commentCount.hasComments {
          color: var(--aha-gray-800);
        }
      `}
    </style>
  );
};
