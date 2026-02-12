import type { FetchProjectsResults } from "./types";

type Project = FetchProjectsResults[number];

export const PROJECT_STAGE_COLORS: Partial<Record<NonNullable<Project["stage"]>, string>> = {
  operational: "bg-green-100 text-green-800 border-green-200",
  in_construction: "bg-blue-100 text-blue-800 border-blue-200",
  early_stage: "bg-yellow-100 text-yellow-800 border-yellow-200",
  late_stage: "bg-orange-100 text-orange-800 border-orange-200",
  ready_to_build: "bg-purple-100 text-purple-800 border-purple-200",
  proposal: "bg-teal-100 text-teal-800 border-teal-200",
};
