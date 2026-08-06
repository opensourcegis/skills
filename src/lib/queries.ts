import { and, asc, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  competencies,
  exercises,
  objectives,
  outcomes,
  skillsetCompetencies,
  skillsets,
  topics,
} from "@/db/schema";

export type SkillsetFilters = {
  q?: string;
  topic?: string;
  competency?: string;
  outcome?: string;
  level?: string;
};

export async function listTopics() {
  const db = getDb();
  return db.select().from(topics).orderBy(asc(topics.name));
}

export async function listCompetencies() {
  const db = getDb();
  return db.select().from(competencies).orderBy(asc(competencies.name));
}

export async function listSkillsets(filters: SkillsetFilters = {}) {
  const db = getDb();

  const conditions = [];

  if (filters.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(skillsets.title, pattern),
        ilike(skillsets.summary, pattern),
        ilike(skillsets.description, pattern),
      ),
    );
  }

  if (filters.topic) {
    conditions.push(eq(topics.slug, filters.topic));
  }

  if (filters.level) {
    conditions.push(eq(skillsets.level, filters.level));
  }

  if (filters.competency) {
    conditions.push(eq(competencies.slug, filters.competency));
  }

  if (filters.outcome) {
    const pattern = `%${filters.outcome}%`;
    conditions.push(ilike(outcomes.statement, pattern));
  }

  const matched = await db
    .select({ id: skillsets.id })
    .from(skillsets)
    .innerJoin(topics, eq(skillsets.topicId, topics.id))
    .leftJoin(
      skillsetCompetencies,
      eq(skillsetCompetencies.skillsetId, skillsets.id),
    )
    .leftJoin(
      competencies,
      eq(skillsetCompetencies.competencyId, competencies.id),
    )
    .leftJoin(outcomes, eq(outcomes.skillsetId, skillsets.id))
    .where(conditions.length ? and(...conditions) : undefined);

  const ids = [...new Set(matched.map((row) => row.id))];
  if (ids.length === 0) return [];

  const rows = await db
    .select({
      id: skillsets.id,
      title: skillsets.title,
      slug: skillsets.slug,
      summary: skillsets.summary,
      level: skillsets.level,
      estimatedHours: skillsets.estimatedHours,
      updatedAt: skillsets.updatedAt,
      topicName: topics.name,
      topicSlug: topics.slug,
    })
    .from(skillsets)
    .innerJoin(topics, eq(skillsets.topicId, topics.id))
    .where(inArray(skillsets.id, ids))
    .orderBy(desc(skillsets.updatedAt));

  const competencyRows = await db
    .select({
      skillsetId: skillsetCompetencies.skillsetId,
      id: competencies.id,
      name: competencies.name,
      slug: competencies.slug,
      category: competencies.category,
    })
    .from(skillsetCompetencies)
    .innerJoin(
      competencies,
      eq(skillsetCompetencies.competencyId, competencies.id),
    )
    .where(inArray(skillsetCompetencies.skillsetId, ids))
    .orderBy(asc(competencies.name));

  const outcomeRows = await db
    .select({
      skillsetId: outcomes.skillsetId,
      id: outcomes.id,
      statement: outcomes.statement,
      bloomLevel: outcomes.bloomLevel,
    })
    .from(outcomes)
    .where(inArray(outcomes.skillsetId, ids))
    .orderBy(asc(outcomes.sortOrder));

  return rows.map((row) => ({
    ...row,
    competencies: competencyRows.filter((c) => c.skillsetId === row.id),
    outcomes: outcomeRows.filter((o) => o.skillsetId === row.id),
  }));
}

export async function getSkillsetBySlug(slug: string) {
  const db = getDb();

  const [skillset] = await db
    .select({
      id: skillsets.id,
      title: skillsets.title,
      slug: skillsets.slug,
      summary: skillsets.summary,
      description: skillsets.description,
      level: skillsets.level,
      estimatedHours: skillsets.estimatedHours,
      createdByEmail: skillsets.createdByEmail,
      createdByName: skillsets.createdByName,
      createdAt: skillsets.createdAt,
      updatedAt: skillsets.updatedAt,
      topicId: skillsets.topicId,
      topicName: topics.name,
      topicSlug: topics.slug,
    })
    .from(skillsets)
    .innerJoin(topics, eq(skillsets.topicId, topics.id))
    .where(eq(skillsets.slug, slug))
    .limit(1);

  if (!skillset) return null;

  const [skillCompetencies, skillObjectives, skillOutcomes, skillExercises] =
    await Promise.all([
      db
        .select({
          id: competencies.id,
          name: competencies.name,
          slug: competencies.slug,
          category: competencies.category,
          description: competencies.description,
        })
        .from(skillsetCompetencies)
        .innerJoin(
          competencies,
          eq(skillsetCompetencies.competencyId, competencies.id),
        )
        .where(eq(skillsetCompetencies.skillsetId, skillset.id))
        .orderBy(asc(competencies.name)),
      db
        .select()
        .from(objectives)
        .where(eq(objectives.skillsetId, skillset.id))
        .orderBy(asc(objectives.sortOrder)),
      db
        .select()
        .from(outcomes)
        .where(eq(outcomes.skillsetId, skillset.id))
        .orderBy(asc(outcomes.sortOrder)),
      db
        .select()
        .from(exercises)
        .where(eq(exercises.skillsetId, skillset.id))
        .orderBy(asc(exercises.sortOrder)),
    ]);

  return {
    ...skillset,
    competencies: skillCompetencies,
    objectives: skillObjectives,
    outcomes: skillOutcomes,
    exercises: skillExercises,
  };
}

export async function getCatalogMeta() {
  const db = getDb();
  const [topicRows, competencyRows, outcomeSamples] = await Promise.all([
    db.select().from(topics).orderBy(asc(topics.name)),
    db.select().from(competencies).orderBy(asc(competencies.name)),
    db
      .select({
        statement: outcomes.statement,
      })
      .from(outcomes)
      .orderBy(asc(outcomes.statement))
      .limit(40),
  ]);

  return {
    topics: topicRows,
    competencies: competencyRows,
    outcomeHints: [
      ...new Set(outcomeSamples.map((row) => row.statement)),
    ].slice(0, 20),
  };
}

export async function databaseReady() {
  try {
    const db = getDb();
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}
