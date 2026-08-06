"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireContributor } from "@/lib/auth";
import {
  insertCourse,
  insertSkillset,
  removeCourse,
  replaceCourse,
  replaceSkillset,
} from "@/lib/queries";
import {
  courseFormSchema,
  skillsetFormSchema,
  type CourseFormValues,
  type SkillsetFormValues,
} from "@/lib/validators";

export type ActionResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

function mapError(error: unknown): string {
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => {
      const field = issue.path.join(".") || "form";
      return `${field}: ${issue.message}`;
    });
    return messages.slice(0, 3).join(" · ");
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHORIZED") {
      return "Please sign in with Google to contribute.";
    }
    if (error.message === "AUTH_NOT_CONFIGURED") {
      return "Google sign-in is not configured yet (AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET).";
    }
    // Surface unexpected errors instead of a blank generic message.
    if (error.message && !error.message.includes("NEXT_REDIRECT")) {
      return error.message;
    }
  }
  return "Unable to save. Check the form and try again.";
}

export async function createSkillset(
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    const contributor = await requireContributor();
    const values = skillsetFormSchema.parse(raw);
    const created = await insertSkillset(values, contributor);
    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath("/courses");
    revalidatePath(`/skillsets/${created.slug}`);
    return { ok: true, slug: created.slug };
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

export async function updateSkillset(
  id: string,
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    await requireContributor();
    const values = skillsetFormSchema.parse(raw);
    const updated = await replaceSkillset(id, values);
    if (!updated) return { ok: false, error: "Skillset not found." };
    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath("/courses");
    revalidatePath(`/skillsets/${updated.slug}`);
    return { ok: true, slug: updated.slug };
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

export async function createCourse(
  raw: CourseFormValues,
): Promise<ActionResult> {
  try {
    const contributor = await requireContributor();
    const values = courseFormSchema.parse(raw);
    const created = await insertCourse(values, contributor);
    revalidatePath("/courses");
    revalidatePath(`/courses/${created.slug}`);
    return { ok: true, slug: created.slug };
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

export async function updateCourse(
  id: string,
  raw: CourseFormValues,
): Promise<ActionResult> {
  try {
    await requireContributor();
    const values = courseFormSchema.parse(raw);
    const updated = await replaceCourse(id, values);
    if (!updated) return { ok: false, error: "Course not found." };
    revalidatePath("/courses");
    revalidatePath(`/courses/${updated.slug}`);
    return { ok: true, slug: updated.slug };
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  try {
    await requireContributor();
    const removed = await removeCourse(id);
    if (!removed) return { ok: false, error: "Course not found." };
    revalidatePath("/courses");
    revalidatePath(`/courses/${removed.slug}`);
    return { ok: true, slug: removed.slug };
  } catch (error) {
    if (isNextRedirect(error)) throw error;
    return { ok: false, error: mapError(error) };
  }
}

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    String((error as { digest?: unknown }).digest).startsWith("NEXT_REDIRECT")
  );
}
