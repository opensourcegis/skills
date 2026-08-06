"use server";

import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import {
  exercises,
  objectives,
  outcomes,
  skillsetCompetencies,
  skillsets,
} from "@/db/schema";
import { requireContributor } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { skillsetFormSchema, type SkillsetFormValues } from "@/lib/validators";

async function uniqueSlug(title: string, excludeId?: string) {
  const db = getDb();
  const base = slugify(title) || "skillset";
  let candidate = base;
  let attempt = 2;

  while (true) {
    const existing = await db
      .select({ id: skillsets.id })
      .from(skillsets)
      .where(
        excludeId
          ? and(eq(skillsets.slug, candidate), ne(skillsets.id, excludeId))
          : eq(skillsets.slug, candidate),
      )
      .limit(1);

    if (existing.length === 0) return candidate;
    candidate = `${base}-${attempt}`;
    attempt += 1;
  }
}

async function writeNestedRecords(
  skillsetId: string,
  values: SkillsetFormValues,
) {
  const db = getDb();

  await db.delete(skillsetCompetencies).where(
    eq(skillsetCompetencies.skillsetId, skillsetId),
  );
  await db.delete(objectives).where(eq(objectives.skillsetId, skillsetId));
  await db.delete(outcomes).where(eq(outcomes.skillsetId, skillsetId));
  await db.delete(exercises).where(eq(exercises.skillsetId, skillsetId));

  if (values.competencyIds.length) {
    await db.insert(skillsetCompetencies).values(
      values.competencyIds.map((competencyId) => ({
        skillsetId,
        competencyId,
      })),
    );
  }

  await db.insert(objectives).values(
    values.objectives.map((statement, index) => ({
      skillsetId,
      statement,
      sortOrder: index,
    })),
  );

  await db.insert(outcomes).values(
    values.outcomes.map((outcome, index) => ({
      skillsetId,
      statement: outcome.statement,
      bloomLevel: outcome.bloomLevel || null,
      sortOrder: index,
    })),
  );

  await db.insert(exercises).values(
    values.exercises.map((exercise, index) => ({
      skillsetId,
      title: exercise.title,
      description: exercise.description,
      exerciseType: exercise.exerciseType,
      durationMinutes: exercise.durationMinutes || null,
      sortOrder: index,
    })),
  );
}

export type ActionResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export async function createSkillset(
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    const contributor = await requireContributor();
    const values = skillsetFormSchema.parse(raw);
    const db = getDb();
    const slug = await uniqueSlug(values.title);

    const [created] = await db
      .insert(skillsets)
      .values({
        title: values.title,
        slug,
        summary: values.summary,
        description: values.description,
        topicId: values.topicId,
        level: values.level,
        estimatedHours: values.estimatedHours || null,
        createdByEmail: contributor.email,
        createdByName: contributor.name,
      })
      .returning({ id: skillsets.id, slug: skillsets.slug });

    await writeNestedRecords(created.id, values);

    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath(`/skillsets/${created.slug}`);
    return { ok: true, slug: created.slug };
  } catch (error) {
    return {
      ok: false,
      error: mapError(error),
    };
  }
}

export async function updateSkillset(
  id: string,
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    await requireContributor();
    const values = skillsetFormSchema.parse(raw);
    const db = getDb();
    const slug = await uniqueSlug(values.title, id);

    const [updated] = await db
      .update(skillsets)
      .set({
        title: values.title,
        slug,
        summary: values.summary,
        description: values.description,
        topicId: values.topicId,
        level: values.level,
        estimatedHours: values.estimatedHours || null,
        updatedAt: new Date(),
      })
      .where(eq(skillsets.id, id))
      .returning({ id: skillsets.id, slug: skillsets.slug });

    if (!updated) {
      return { ok: false, error: "Skillset not found." };
    }

    await writeNestedRecords(updated.id, values);

    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath(`/skillsets/${updated.slug}`);
    return { ok: true, slug: updated.slug };
  } catch (error) {
    return {
      ok: false,
      error: mapError(error),
    };
  }
}

export async function deleteSkillset(id: string): Promise<ActionResult> {
  try {
    await requireContributor();
    const db = getDb();
    const [removed] = await db
      .delete(skillsets)
      .where(eq(skillsets.id, id))
      .returning({ slug: skillsets.slug });

    revalidatePath("/");
    revalidatePath("/skillsets");
    if (removed) {
      revalidatePath(`/skillsets/${removed.slug}`);
    }
    return { ok: true, slug: removed?.slug ?? "" };
  } catch (error) {
    return { ok: false, error: mapError(error) };
  }
}

function mapError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return "Please sign in to contribute.";
    }
    if (error.message === "FORBIDDEN") {
      return "Your email is not on the faculty allowlist.";
    }
    if (error.message.includes("DATABASE_URL")) {
      return "Database is not configured yet.";
    }
  }
  return "Unable to save skillset. Check the form and try again.";
}
