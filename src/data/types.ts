export type Level = "beginner" | "intermediate" | "advanced";
export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";

export type SessionKind = "theory" | "demo" | "exercise";

export type AssessmentStrategyId =
  | "quiz_mcq"
  | "practical_lab_test"
  | "project_portfolio"
  | "presentation_viva"
  | "peer_assessment"
  | "rubric_assignment"
  | "field_report"
  | "open_book_test"
  | "continuous_assessment"
  | "capstone_mini_project";

export type Topic = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export type Competency = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
};

export type Objective = {
  id: string;
  statement: string;
  sortOrder: number;
};

export type Outcome = {
  id: string;
  statement: string;
  bloomLevel: BloomLevel | null;
  sortOrder: number;
};

export type SessionItem = {
  id: string;
  kind: SessionKind;
  title: string;
  description: string;
  durationMinutes: number | null;
  sortOrder: number;
};

export type Skillset = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  topicId: string;
  level: Level;
  estimatedHours: number | null;
  createdByEmail: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
  competencyIds: string[];
  objectives: Objective[];
  outcomes: Outcome[];
  /** @deprecated prefer sessions; kept for older records */
  exercises?: SessionItem[];
  sessions: SessionItem[];
  assessmentStrategyIds: AssessmentStrategyId[];
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  code: string;
  summary: string;
  targetAudience: string;
  skillsetIds: string[];
  createdByEmail: string;
  createdByName: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GeoSkillsDb = {
  topics: Topic[];
  competencies: Competency[];
  skillsets: Skillset[];
  courses: Course[];
};

export function emptyDb(): GeoSkillsDb {
  return { topics: [], competencies: [], skillsets: [], courses: [] };
}
