import { selector, selectorFamily } from "recoil";
import { githubExtensionFieldScope } from "./bookmark";
import { recordsSelector } from "./records";

const featuresSelector = selector<Aha.Feature[]>({
  key: "features",
  get: ({ get }) => {
    const records = get(recordsSelector);
    return records.filter(
      (record) => record.typename === "Feature"
    ) as Aha.Feature[];
  },
});

export const requirementsSelector = selector<Record<string, Aha.Requirement[]>>(
  {
    key: "requirements",
    get: async ({ get }) => {
      const features = get(featuresSelector);

      const featuresWithReqs = await aha.models.Feature.select("id")
        .merge({
          requirements: aha.models.Requirement.select(
            "id",
            "name",
            "referenceNum",
            "commentsCount"
          ).merge({
            teamWorkflowStatus: aha.models.WorkflowStatus.select([
              "id",
              "color",
            ]),
            assignedToUser: aha.models.User.select(["id", "name", "avatarUrl"]),
            extensionFields: githubExtensionFieldScope,
          }),
        })
        .where({ id: features.map((feature) => feature.id) })
        .all();

      return featuresWithReqs.reduce(
        (acc, feature) => ({
          [feature.id]: feature.requirements.filter(
            (req) => req.assignedToUser.id === aha.user.id
          ),
          ...acc,
        }),
        {} as Record<string, Aha.Requirement[]>
      );
    },
  }
);

export const featureRequirements = selectorFamily<Aha.Requirement[], string>({
  key: "featureRequirements",
  get:
    (featureId) =>
    ({ get }) => {
      return get(requirementsSelector)[featureId];
    },
});
