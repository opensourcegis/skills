export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export const LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type Level = (typeof LEVELS)[number];

export const BLOOM_LEVELS = [
  "remember",
  "understand",
  "apply",
  "analyze",
  "evaluate",
  "create",
] as const;
export type BloomLevel = (typeof BLOOM_LEVELS)[number];

export const SESSION_KINDS = ["theory", "demo", "exercise"] as const;
export type SessionKind = (typeof SESSION_KINDS)[number];

export const ASSESSMENT_STRATEGIES = [
  {
    id: "quiz_mcq",
    label: "Quiz / multiple choice",
    description: "Short knowledge checks or timed MCQ tests.",
  },
  {
    id: "practical_lab_test",
    label: "Practical / lab test",
    description: "Observed GIS or remote-sensing task under timed conditions.",
  },
  {
    id: "project_portfolio",
    label: "Project / portfolio",
    description: "Submitted maps, notebooks, or analysis portfolio.",
  },
  {
    id: "presentation_viva",
    label: "Presentation / viva",
    description: "Oral defense of methods and interpretation.",
  },
  {
    id: "peer_assessment",
    label: "Peer assessment",
    description: "Structured review of classmates’ maps or reports.",
  },
  {
    id: "rubric_assignment",
    label: "Rubric-based assignment",
    description: "Written or mapped deliverable scored with a rubric.",
  },
  {
    id: "field_report",
    label: "Field report",
    description: "Documented GNSS / field collection and QA notes.",
  },
  {
    id: "open_book_test",
    label: "Open-book test",
    description: "Scenario problems with notes or software allowed.",
  },
  {
    id: "continuous_assessment",
    label: "Continuous assessment",
    description: "Weekly labs or checkpoints across the module.",
  },
  {
    id: "capstone_mini_project",
    label: "Capstone / mini-project",
    description: "End-of-course integrated geospatial project.",
  },
] as const;

export type AssessmentStrategyId =
  (typeof ASSESSMENT_STRATEGIES)[number]["id"];
