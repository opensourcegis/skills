export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function parseAllowedEmails(raw = process.env.ALLOWED_EMAILS): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,;]+/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  const allowlist = parseAllowedEmails();
  if (allowlist.length === 0) {
    // Empty allowlist means any signed-in user may contribute (dev-friendly).
    return true;
  }
  return allowlist.includes(email.trim().toLowerCase());
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

export const EXERCISE_TYPES = [
  "lab",
  "fieldwork",
  "project",
  "discussion",
  "assessment",
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];
