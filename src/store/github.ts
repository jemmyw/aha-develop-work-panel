import { Octokit } from "@octokit/rest";
import gql from "gql-tag";
import { atom, noWait, selector, selectorFamily } from "recoil";
import { PrInfo } from "../PrInfo";
import { reactiveReloadId } from "./bookmark";
import { recordsSelector } from "./records";
import { requirementsSelector } from "./requirements";

type AuthState = "unknown" | "error" | "authing" | "authed";

export const githubLabelsState = atom<boolean>({
  key: "githubLabels",
  default: false,
});

export const forceAuthState = atom<boolean>({
  key: "forceAuth",
  default: false,
});

export const authTokenSelector = selector<string>({
  key: "authData",
  get: async ({ get }) => {
    const force = get(forceAuthState);

    return aha
      .auth("github", {
        useCachedRetry: true,
        reAuth: force,
      })
      .then(({ token }) => token)
      .catch(() => "");
  },
});

export const authStateSelector = selector<AuthState>({
  key: "authState",
  get: ({ get }) => {
    const force = get(forceAuthState);
    const authToken = get(noWait(authTokenSelector));

    switch (authToken.state) {
      case "hasValue":
        if (authToken.contents === "" && force) return "error";
        if (authToken.contents === "") return "unknown";
        return "authed";
      case "loading":
        return "authing";
      case "hasError":
        if (force) {
          return "error";
        } else {
          return "unknown";
        }
    }
  },
});

const repoFromUrl = (url: string) =>
  new URL(url).pathname.split("/").copyWithin(-2, -1).slice(1, 4) as [
    string,
    string,
    string
  ];

const PrFragment = gql`
  fragment Pr on PullRequest {
    url
    number
    state
    merged
    reviewDecision
    commits(last: 1) {
      nodes {
        commit {
          statusCheckRollup {
            state
          }
        }
      }
    }
  }
`;

const LabelsFragment = gql`
  fragment Labels on PullRequest {
    labels(first: 5) {
      nodes {
        color
        name
      }
    }
  }
`;

const prQuery = (idx: number) =>
  gql`
  pr_idx: repository(owner: $owner_idx, name: $repo_idx) {
    pullRequest(number: $number_idx) {
      __typename
      ...Pr
      ...Labels @include(if: $includeLabels)
    }
  }
`.replaceAll("_idx", `_${idx}`);

const recordPrInfo = (record: Aha.RecordUnion) =>
  (record.extensionFields.find((f) => f.name === "pullRequests")
    ?.value as PrInfo[]) || [];

export const githubPullRequestsSelector = selector({
  key: "githubPullRequests",
  get: async ({ get }) => {
    const githubLabels = get(githubLabelsState);
    const authToken = get(authTokenSelector);
    const records = get(recordsSelector);
    const requirements = get(noWait(requirementsSelector)).valueMaybe() || {};

    if (authToken === "") return {};

    const api = new Octokit({ auth: authToken });
    const prInfo = [
      ...new Set(
        [
          ...records.flatMap(recordPrInfo),
          ...Object.values(requirements).flatMap((rs) =>
            rs.flatMap(recordPrInfo)
          ),
        ].map((p) => p.url)
      ),
    ];

    if (prInfo.length === 0) return {};

    const [queries, variables, params] = prInfo.reduce(
      (acc, url, idx) => {
        const [owner, repo, number] = repoFromUrl(url);
        const vars = {
          [`owner_${idx}`]: owner,
          [`repo_${idx}`]: repo,
          [`number_${idx}`]: Number(number),
        };

        return [
          [...acc[0], prQuery(idx)],
          {
            ...acc[1],
            ...vars,
          },
          [
            ...acc[2],
            `$owner_${idx}: String!`,
            `$repo_${idx}: String!`,
            `$number_${idx}: Int!`,
          ],
        ];
      },
      [[], {}, []] as [string[], { [key: string]: any }, string[]]
    );

    const query =
      "query GetPrs($includeLabels: Boolean!, " +
      params.join(", ") +
      ") { " +
      queries.join("\n") +
      " }\n\n" +
      PrFragment +
      LabelsFragment;

    const result = (await api.graphql(query, {
      includeLabels: githubLabels,
      ...variables,
    })) as any;

    return Object.keys(result).reduce((acc, key) => {
      const url = result[key].pullRequest.url;
      return {
        ...acc,
        [url]: result[key].pullRequest,
      };
    }, {} as { [key: string]: GetPRPullRequest });
  },
  dangerouslyAllowMutability: true,
});

export const githubPullRequestSelector = selectorFamily<
  GetPRPullRequest | undefined,
  string
>({
  key: "githubPullRequest",
  get:
    (url) =>
    ({ get }) => {
      return get(githubPullRequestsSelector)[url];
    },
});

export interface GetPRPullRequest {
  __typename: string;
  url: string;
  number: number;
  state: "OPEN" | "MERGED" | "CLOSED";
  merged: boolean;
  labels?: Labels;
  reviewDecision:
    | "REVIEW_REQUIRED"
    | "APPROVED"
    | "CHANGES_REQUESTED"
    | "COMMENTED"
    | null;
  commits: Commits;
}

export interface Commits {
  nodes: Node[];
}

export interface Node {
  commit: Commit;
}

export interface Commit {
  statusCheckRollup: StatusCheckRollup;
}

export interface StatusCheckRollup {
  state: "EXPECTED" | "ERROR" | "FAILURE" | "SUCCESS" | "PENDING";
}

export interface Labels {
  nodes: Label[];
}

export interface Label {
  color: string;
  name: string;
}
