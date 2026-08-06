import { loadDatabase, saveDatabase, newId } from "@/data/store";
import type {
  AssessmentStrategyId,
  Competency,
  Course,
  GeoSkillsDb,
  SessionItem,
  Skillset,
} from "@/data/types";
import { ASSESSMENT_STRATEGIES, slugify } from "@/lib/utils";
import type { CourseFormValues, SkillsetFormValues } from "@/lib/validators";

export type SkillsetFilters = {
  q?: string;
  topic?: string;
  competency?: string;
  outcome?: string;
  level?: string;
};

function withRelations(db: GeoSkillsDb, skillset: Skillset) {
  const topic = db.topics.find((item) => item.id === skillset.topicId);
  const competencies = db.competencies.filter((item) =>
    skillset.competencyIds.includes(item.id),
  );
  const assessments = ASSESSMENT_STRATEGIES.filter((item) =>
    skillset.assessmentStrategyIds.includes(item.id),
  );
  return {
    ...skillset,
    topicName: topic?.name ?? "Untitled topic",
    topicSlug: topic?.slug ?? "topic",
    competencies,
    assessments,
  };
}

export async function listTopics() {
  const db = await loadDatabase();
  return [...db.topics].sort((a, b) => a.name.localeCompare(b.name));
}

export async function listCompetencies() {
  const db = await loadDatabase();
  return [...db.competencies].sort((a, b) => a.name.localeCompare(b.name));
}

export async function listSkillsets(filters: SkillsetFilters = {}) {
  const db = await loadDatabase();
  let rows = db.skillsets.map((skillset) => withRelations(db, skillset));

  if (filters.q) {
    const q = filters.q.toLowerCase();
    rows = rows.filter(
      (row) =>
        row.title.toLowerCase().includes(q) ||
        row.summary.toLowerCase().includes(q) ||
        row.description.toLowerCase().includes(q),
    );
  }
  if (filters.topic) {
    rows = rows.filter((row) => row.topicSlug === filters.topic);
  }
  if (filters.level) {
    rows = rows.filter((row) => row.level === filters.level);
  }
  if (filters.competency) {
    rows = rows.filter((row) =>
      row.competencies.some((item) => item.slug === filters.competency),
    );
  }
  if (filters.outcome) {
    const needle = filters.outcome.toLowerCase();
    rows = rows.filter((row) =>
      row.outcomes.some((item) =>
        item.statement.toLowerCase().includes(needle),
      ),
    );
  }

  return rows.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getSkillsetBySlug(slug: string) {
  const db = await loadDatabase();
  const skillset = db.skillsets.find((item) => item.slug === slug);
  if (!skillset) return null;
  return withRelations(db, skillset);
}

export async function getCatalogMeta() {
  const db = await loadDatabase();
  return {
    topics: [...db.topics].sort((a, b) => a.name.localeCompare(b.name)),
    competencies: [...db.competencies].sort((a, b) =>
      a.name.localeCompare(b.name),
    ),
  };
}

function uniqueSlug(
  existing: { slug: string; id?: string }[],
  title: string,
  excludeId?: string,
) {
  const base = slugify(title) || "item";
  let candidate = base;
  let attempt = 2;
  while (
    existing.some((item) => item.slug === candidate && item.id !== excludeId)
  ) {
    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
  return candidate;
}

function buildSessions(values: SkillsetFormValues): SessionItem[] {
  return values.sessions.map((session, index) => ({
    id: newId("sess"),
    kind: session.kind,
    title: session.title,
    description: session.description,
    durationMinutes: session.durationMinutes ?? null,
    sortOrder: index,
  }));
}

function ensureCompetencies(
  db: GeoSkillsDb,
  values: SkillsetFormValues,
): string[] {
  const ids = [...values.competencyIds];
  for (const created of values.newCompetencies ?? []) {
    const slug = uniqueSlug(db.competencies, created.name);
    const competency: Competency = {
      id: newId("comp"),
      name: created.name,
      slug,
      category: created.category,
      description: created.description?.trim() || "",
    };
    db.competencies.push(competency);
    ids.push(competency.id);
  }
  return [...new Set(ids)];
}

export async function insertSkillset(
  values: SkillsetFormValues,
  contributor: { email: string; name: string | null },
) {
  const db = await loadDatabase();
  const now = new Date().toISOString();
  const competencyIds = ensureCompetencies(db, values);
  const skillset: Skillset = {
    id: newId("skill"),
    title: values.title,
    slug: uniqueSlug(db.skillsets, values.title),
    summary: values.summary,
    description: values.description,
    topicId: values.topicId,
    level: values.level,
    estimatedHours: values.estimatedHours ?? null,
    createdByEmail: contributor.email,
    createdByName: contributor.name,
    createdAt: now,
    updatedAt: now,
    competencyIds,
    objectives: values.objectives.map((statement, index) => ({
      id: newId("obj"),
      statement,
      sortOrder: index,
    })),
    outcomes: values.outcomes.map((outcome, index) => ({
      id: newId("out"),
      statement: outcome.statement,
      bloomLevel: outcome.bloomLevel ?? null,
      sortOrder: index,
    })),
    sessions: buildSessions(values),
    assessmentStrategyIds: values.assessmentStrategyIds as AssessmentStrategyId[],
  };
  db.skillsets.unshift(skillset);
  await saveDatabase(db);
  return skillset;
}

export async function replaceSkillset(
  id: string,
  values: SkillsetFormValues,
) {
  const db = await loadDatabase();
  const index = db.skillsets.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const existing = db.skillsets[index];
  const competencyIds = ensureCompetencies(db, values);
  const updated: Skillset = {
    ...existing,
    title: values.title,
    slug: uniqueSlug(db.skillsets, values.title, id),
    summary: values.summary,
    description: values.description,
    topicId: values.topicId,
    level: values.level,
    estimatedHours: values.estimatedHours ?? null,
    updatedAt: new Date().toISOString(),
    competencyIds,
    objectives: values.objectives.map((statement, i) => ({
      id: newId("obj"),
      statement,
      sortOrder: i,
    })),
    outcomes: values.outcomes.map((outcome, i) => ({
      id: newId("out"),
      statement: outcome.statement,
      bloomLevel: outcome.bloomLevel ?? null,
      sortOrder: i,
    })),
    sessions: buildSessions(values),
    assessmentStrategyIds: values.assessmentStrategyIds as AssessmentStrategyId[],
  };
  db.skillsets[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function listCourses() {
  const db = await loadDatabase();
  return [...db.courses].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function getCourseBySlug(slug: string) {
  const db = await loadDatabase();
  const course = db.courses.find((item) => item.slug === slug);
  if (!course) return null;

  const skillsets = course.skillsetIds
    .map((id) => db.skillsets.find((item) => item.id === id))
    .filter(Boolean)
    .map((skillset) => withRelations(db, skillset!));

  const competencyMap = new Map(
    skillsets.flatMap((skillset) =>
      skillset.competencies.map((item) => [item.id, item] as const),
    ),
  );
  const objectiveStatements = skillsets.flatMap((skillset) =>
    skillset.objectives.map((item) => ({
      statement: item.statement,
      from: skillset.title,
    })),
  );
  const outcomeStatements = skillsets.flatMap((skillset) =>
    skillset.outcomes.map((item) => ({
      statement: item.statement,
      bloomLevel: item.bloomLevel,
      from: skillset.title,
    })),
  );
  const sessions = skillsets.flatMap((skillset) =>
    skillset.sessions.map((session) => ({
      ...session,
      from: skillset.title,
    })),
  );
  const assessmentIds = [
    ...new Set(skillsets.flatMap((item) => item.assessmentStrategyIds)),
  ];
  const assessments = ASSESSMENT_STRATEGIES.filter((item) =>
    assessmentIds.includes(item.id),
  );

  return {
    ...course,
    skillsets,
    competencies: [...competencyMap.values()],
    objectives: objectiveStatements,
    outcomes: outcomeStatements,
    sessions,
    assessments,
    theorySessions: sessions.filter((item) => item.kind === "theory"),
    demoSessions: sessions.filter((item) => item.kind === "demo"),
    exerciseSessions: sessions.filter((item) => item.kind === "exercise"),
  };
}

export async function insertCourse(
  values: CourseFormValues,
  contributor: { email: string; name: string | null },
) {
  const db = await loadDatabase();
  const now = new Date().toISOString();
  const course: Course = {
    id: newId("course"),
    title: values.title,
    code: values.code,
    slug: uniqueSlug(db.courses, values.title),
    summary: values.summary,
    targetAudience: values.targetAudience,
    skillsetIds: values.skillsetIds,
    createdByEmail: contributor.email,
    createdByName: contributor.name,
    createdAt: now,
    updatedAt: now,
  };
  db.courses.unshift(course);
  await saveDatabase(db);
  return course;
}

export async function replaceCourse(id: string, values: CourseFormValues) {
  const db = await loadDatabase();
  const index = db.courses.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const existing = db.courses[index];
  const updated: Course = {
    ...existing,
    title: values.title,
    code: values.code,
    slug: uniqueSlug(db.courses, values.title, id),
    summary: values.summary,
    targetAudience: values.targetAudience,
    skillsetIds: values.skillsetIds,
    updatedAt: new Date().toISOString(),
  };
  db.courses[index] = updated;
  await saveDatabase(db);
  return updated;
}

export async function removeCourse(id: string) {
  const db = await loadDatabase();
  const existing = db.courses.find((item) => item.id === id);
  if (!existing) return null;
  db.courses = db.courses.filter((item) => item.id !== id);
  await saveDatabase(db);
  return existing;
}
