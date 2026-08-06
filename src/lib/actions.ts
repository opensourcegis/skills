"use server";

import { revalidatePath } from "next/cache";
import { insertSkillset, replaceSkillset } from "@/lib/queries";
import { skillsetFormSchema, type SkillsetFormValues } from "@/lib/validators";

export type ActionResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export async function createSkillset(
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    const values = skillsetFormSchema.parse(raw);
    const created = await insertSkillset(values);
    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath(`/skillsets/${created.slug}`);
    return { ok: true, slug: created.slug };
  } catch {
    return {
      ok: false,
      error: "Unable to save skillset. Check the form and try again.",
    };
  }
}

export async function updateSkillset(
  id: string,
  raw: SkillsetFormValues,
): Promise<ActionResult> {
  try {
    const values = skillsetFormSchema.parse(raw);
    const updated = await replaceSkillset(id, values);
    if (!updated) {
      return { ok: false, error: "Skillset not found." };
    }
    revalidatePath("/");
    revalidatePath("/skillsets");
    revalidatePath(`/skillsets/${updated.slug}`);
    return { ok: true, slug: updated.slug };
  } catch {
    return {
      ok: false,
      error: "Unable to update skillset. Check the form and try again.",
    };
  }
}
