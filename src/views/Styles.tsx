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
        .light {
          --green: green;
        }
        .dark { --green: rgb(100,255,50); }

        a {
          color: var(--theme-link-text);
        }

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
          background-color: var(--theme-primary-background);
          padding: 0;
          border-bottom: 1px solid var(--aha-gray-400);
        }

        .record-expand {
          color: var(--theme-secondary-text);
        }

        .record .info {
          display: flex;
          align-items: "center";
          color: var(--theme-tertiary-text);
          background-color: var(--theme-tertiary-background);
          border-top: 1px solid var(--theme-secondary-border);
          border-bottom: 1px solid var(--theme-primary-background);
          font-size: 10px;
        }

        .record .info aha-icon {
          font-size: 11px;
        }

        .i-p {
          display: flex;
          align-items: center;
          border: 1px solid rgba(0, 0, 0, 0);
          border-left: 1px solid var(--theme-primary-background);
          border-right: 1px solid var(--theme-secondary-border);
          padding: 1px 3px 0 3px;
        }

        .i-p.commentCount {
          color: var(--aha-gray-600);
        }
        .dark .i-p.commentCount {
          color: var(--aha-gray-500);
        }
        .i-p.commentCount aha-icon,
        .i-p.estimate aha-icon {
          margin-right: 3px;
        }
        .i-p.commentCount.hasComments {
          color: var(--aha-gray-800);
        }
        .dark .i-p.commentCount.hasComments {
          color: var(--aha-gray-200);
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
        .i-p.pr-l {
          display: flex;
        }
        .i-p.pr-l > div {
          border-radius: 2px;
          padding: 1px 3px 0 3px;
          overflow: hidden;
          white-space: nowrap;
          margin-left: -2px;
          font-size: 0pt;
          transition: width 0.2s, margin 0.2s, font-size 0.2s;
        }
        .i-p.pr-l > div:first-child {
          margin-left: 0px;
        }
        .i-p.pr-l > div::first-letter {
          font-size: 10px;
        }
        .i-p.pr-l:hover {
          gap: 3px;
        }
        .i-p.pr-l:hover > div {
          margin-left: 0;
          font-size: 10px;
        }

        .i-p.pr-r.approved {
          color: var(--green);
        }
        .i-p.pr-r.changes_requested {
          color: yellow;
        }
        .i-p.pr-r.commented {
          color: var(--aha-gray-800);
        }
        .dark .i-p.pr-r.commented {
          color: var(--aha-gray-300);
        }
        .i-p.pr-r.review_required {
          color: var(--aha-gray-800);
        }
        .dark .i-p.pr-r.review_required {
          color: var(--aha-gray-300);
        }


        .requirements {
          padding: 5px 0 5px 10px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .requirement {
          display: flex;
          gap: 5px;
        }

        .requirement-status {
          padding-top: 2px;
          font-size: 9px;
        }

        .requirement-ref {
          white-space: nowrap;
        }

        .requirement-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .requirement-github {
          display: flex;
          font-size: 90%;
        }

        .requirement-github .i-p {
          padding: 0 2px;
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
