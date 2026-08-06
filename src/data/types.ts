export type Level = "beginner" | "intermediate" | "advanced";
export type BloomLevel =
  | "remember"
  | "understand"
  | "apply"
  | "analyze"
  | "evaluate"
  | "create";
export type ExerciseType =
  | "lab"
  | "fieldwork"
  | "project"
  | "discussion"
  | "assessment";

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

export type Exercise = {
  id: string;
  title: string;
  description: string;
  exerciseType: ExerciseType;
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
  exercises: Exercise[];
};

export type GeoSkillsDb = {
  topics: Topic[];
  competencies: Competency[];
  skillsets: Skillset[];
};

export function emptyDb(): GeoSkillsDb {
  return { topics: [], competencies: [], skillsets: [] };
}
