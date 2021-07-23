import { GetPRPullRequest } from "../github";

export function mapStatusCheck(pr: GetPRPullRequest) {
  const commit = pr.commits.nodes[0];
  if (!commit) return null;
  return commit.commit.statusCheckRollup;
}
