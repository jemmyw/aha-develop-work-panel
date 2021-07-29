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
        .workflow-status > .title {
          padding: 3px 8px;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .workflow-status > .title .name {
          font-size: 14px;
        }

        .workflow-status > .title .record-count {
          font-size: 12px;
        }

        .record-list {
          background-color: var(--aha-gray-200);
          padding-left: 5px;
        }

        .record .ref {
          font-size: 11px;
          padding: 4px 6px 0 6px;
        }

        .record .name {
          padding: 4px 6px;
        }

        .record {
          background-color: white;
          padding: 0;
          border-bottom: 1px solid var(--aha-gray-400);
        }

        .record .info {
          display: flex;
          align-items: "center";
          color: var(--aha-gray-800);
          background-color: var(--aha-gray-200);
          border-top: 1px solid var(--aha-gray-400);
          border-bottom: 1px solid white;
          font-size: 10px;
        }

        .record .info aha-icon {
          font-size: 11px;
        }

        .i-p {
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0);
          border-left: 1px solid white;
          border-right: 1px solid var(--aha-gray-400);
          padding: 1px 3px 0 3px;
        }

        .i-p.commentCount {
          color: var(--aha-gray-600);
        }
        .i-p.commentCount aha-icon,
        .i-p.estimate aha-icon {
          margin-right: 3px;
        }
        .i-p.commentCount.hasComments {
          color: var(--aha-gray-800);
        }

        .i-p.pr-s {
          border: 1px solid black;
          border-radius: 2px;
        }
        .i-p.pr-s.open {
          color: #4f8f0e;
          border-color: #4f8f0e;
          background-color: #e5f3d6;
        }
        .i-p.pr-s.merged {
          color: #463159;
          border-color: #463159;
          background-color: #e5dced;
        }
        .i-p.pr-s.closed {
          color: #992e0b;
          border-color: #992e0b;
          background-color: #fae7e1;
        }
        .i-p.pr-s.draft {
          color: #0b0b0b;
          background-color: #b8c0c9;
        }

        .github-auth {
          position: absolute;
          bottom: 0px;
          right: 0px;
        }
      `}
    </style>
  );
};
