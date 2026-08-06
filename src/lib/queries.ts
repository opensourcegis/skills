import { loadDatabase, saveDatabase, newId } from "@/data/store";
import type { GeoSkillsDb, Skillset } from "@/data/types";
import { slugify } from "@/lib/utils";
import type { SkillsetFormValues } from "@/lib/validators";

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
  return {
    ...skillset,
    topicName: topic?.name ?? "Untitled topic",
    topicSlug: topic?.slug ?? "topic",
    competencies,
    outcomes: skillset.outcomes,
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
    outcomeHints: db.skillsets
      .flatMap((item) => item.outcomes.map((outcome) => outcome.statement))
      .slice(0, 20),
  };
}

function uniqueSlug(db: GeoSkillsDb, title: string, excludeId?: string) {
  const base = slugify(title) || "skillset";
  let candidate = base;
  let attempt = 2;
  while (
    db.skillsets.some(
      (item) => item.slug === candidate && item.id !== excludeId,
    )
  ) {
    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
  return candidate;
}

function buildNested(values: SkillsetFormValues) {
  return {
    competencyIds: values.competencyIds,
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
    exercises: values.exercises.map((exercise, index) => ({
      id: newId("ex"),
      title: exercise.title,
      description: exercise.description,
      exerciseType: exercise.exerciseType,
      durationMinutes: exercise.durationMinutes ?? null,
      sortOrder: index,
    })),
  };
}

export async function insertSkillset(values: SkillsetFormValues) {
  const db = await loadDatabase();
  const now = new Date().toISOString();
  const nested = buildNested(values);
  const skillset: Skillset = {
    id: newId("skill"),
    title: values.title,
    slug: uniqueSlug(db, values.title),
    summary: values.summary,
    description: values.description,
    topicId: values.topicId,
    level: values.level,
    estimatedHours: values.estimatedHours ?? null,
    createdByEmail: "faculty@geoskills.local",
    createdByName: "Faculty contributor",
    createdAt: now,
    updatedAt: now,
    ...nested,
  };
  db.skillsets.unshift(skillset);
  await saveDatabase(db);
  return skillset;
}

export async function replaceSkillset(id: string, values: SkillsetFormValues) {
  const db = await loadDatabase();
  const index = db.skillsets.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const existing = db.skillsets[index];
  const nested = buildNested(values);
  const updated: Skillset = {
    ...existing,
    title: values.title,
    slug: uniqueSlug(db, values.title, id),
    summary: values.summary,
    description: values.description,
    topicId: values.topicId,
    level: values.level,
    estimatedHours: values.estimatedHours ?? null,
    updatedAt: new Date().toISOString(),
    ...nested,
  };
  db.skillsets[index] = updated;
  await saveDatabase(db);
  return updated;
}

export { databaseReady } from "@/data/store";
