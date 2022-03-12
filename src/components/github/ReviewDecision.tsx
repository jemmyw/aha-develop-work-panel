import React from "react";
import { GetPRPullRequest } from "../../store/github";

function reviewStyle(
  reviewDecision: Exclude<GetPRPullRequest["reviewDecision"], null>
) {
  switch (reviewDecision) {
    case "APPROVED":
      return { color: "var(--green)", icon: "fa-user-check" };
    case "CHANGES_REQUESTED":
      return { color: "yellow", icon: "fa-user-edit" };
    case "COMMENTED":
      return { color: "var(--aha-gray-800)", icon: "fa-comment" };
    case "REVIEW_REQUIRED":
      return { color: "var(--aha-gray-400)", icon: "fa-user" };
  }
}

export const ReviewDecision: React.FC<{
  reviewDecision: Exclude<GetPRPullRequest["reviewDecision"], null>;
}> = ({ reviewDecision }) => {
  const { color, icon } = reviewStyle(reviewDecision);

  return (
    <div className={"i-p pr-r " + reviewDecision.toLowerCase()}>
      <aha-icon icon={"fa-solid " + icon} />
    </div>
  );
};
