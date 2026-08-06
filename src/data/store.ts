import { deflateSync, inflateSync } from "node:zlib";
import { cookies } from "next/headers";
import { createClient } from "@vercel/edge-config";
import { seedDatabase } from "@/data/seed-data";
import type {
  AssessmentStrategyId,
  Competency,
  Course,
  GeoSkillsDb,
  SessionItem,
  Skillset,
} from "@/data/types";
import {
  EDGE_CONFIG_DB_KEY,
  EDGE_CONFIG_ID,
  EDGE_CONFIG_TOKEN,
  EDGE_CONFIG_URL,
  EDGE_CONFIG_WRITE_TOKEN,
} from "@/lib/config";

declare global {
  // eslint-disable-next-line no-var
  var __geoskillsMemoryBase: GeoSkillsDb | undefined;
}

const OVERLAY_COOKIE = "gs_overlay";
const OVERLAY_CHUNK_SIZE = 3000;
const OVERLAY_MAX_CHUNKS = 12;

type DbOverlay = {
  v: 1;
  courses: Course[];
  skillsets: Skillset[];
  competencies: Competency[];
  removedCourseIds: string[];
  removedSkillsetIds: string[];
  removedCompetencyIds: string[];
};

function cloneDb(db: GeoSkillsDb): GeoSkillsDb {
  return structuredClone(db);
}

function normalizeSkillset(raw: Skillset): Skillset {
  const legacyExercises = (raw.exercises ?? []).map((item, index) => {
    const legacy = item as SessionItem & { exerciseType?: string };
    return {
      id: legacy.id || `legacy-ex-${index}`,
      kind: "exercise" as const,
      title: legacy.title,
      description: legacy.description,
      durationMinutes: legacy.durationMinutes ?? null,
      sortOrder: legacy.sortOrder ?? index,
    };
  });

  const sessions =
    raw.sessions && raw.sessions.length > 0 ? raw.sessions : legacyExercises;

  return {
    ...raw,
    sessions,
    assessmentStrategyIds: (raw.assessmentStrategyIds ??
      []) as AssessmentStrategyId[],
  };
}

function normalizeDb(value: GeoSkillsDb): GeoSkillsDb {
  return {
    topics: value.topics ?? [],
    competencies: value.competencies ?? [],
    skillsets: (value.skillsets ?? []).map(normalizeSkillset),
    courses: value.courses ?? [],
  };
}

function isValidDb(value: unknown): value is GeoSkillsDb {
  if (!value || typeof value !== "object") return false;
  const candidate = value as GeoSkillsDb;
  return (
    Array.isArray(candidate.topics) &&
    Array.isArray(candidate.competencies) &&
    Array.isArray(candidate.skillsets)
  );
}

function applyOverlay(base: GeoSkillsDb, overlay: DbOverlay | null): GeoSkillsDb {
  if (!overlay) return base;

  const removedSkillsets = new Set(overlay.removedSkillsetIds);
  const removedCompetencies = new Set(overlay.removedCompetencyIds);

  // Courses: overlay is the full user-created list (seed ships with none).
  const courses = [...overlay.courses].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  const skillsets = new Map(base.skillsets.map((item) => [item.id, item]));
  for (const item of overlay.skillsets) {
    skillsets.set(item.id, normalizeSkillset(item));
  }
  for (const id of removedSkillsets) skillsets.delete(id);

  const competencies = new Map(
    base.competencies.map((item) => [item.id, item]),
  );
  for (const item of overlay.competencies) competencies.set(item.id, item);
  for (const id of removedCompetencies) competencies.delete(id);

  return {
    topics: base.topics,
    competencies: [...competencies.values()],
    skillsets: [...skillsets.values()],
    courses,
  };
}

function buildOverlay(db: GeoSkillsDb): DbOverlay {
  const seedSkillsets = new Map(
    seedDatabase.skillsets.map((item) => [item.id, item]),
  );
  const seedCompetencies = new Map(
    seedDatabase.competencies.map((item) => [item.id, item]),
  );
  const seedSkillsetIds = new Set(seedSkillsets.keys());
  const seedCompetencyIds = new Set(seedCompetencies.keys());
  const dbSkillsetIds = new Set(db.skillsets.map((item) => item.id));
  const dbCompetencyIds = new Set(db.competencies.map((item) => item.id));

  const skillsets = db.skillsets.filter((item) => {
    const seed = seedSkillsets.get(item.id);
    if (!seed) return true;
    return JSON.stringify(normalizeSkillset(item)) !== JSON.stringify(seed);
  });

  const competencies = db.competencies.filter((item) => {
    const seed = seedCompetencies.get(item.id);
    if (!seed) return true;
    return JSON.stringify(item) !== JSON.stringify(seed);
  });

  return {
    v: 1,
    courses: db.courses,
    skillsets,
    competencies,
    removedCourseIds: [],
    removedSkillsetIds: [...seedSkillsetIds].filter(
      (id) => !dbSkillsetIds.has(id),
    ),
    removedCompetencyIds: [...seedCompetencyIds].filter(
      (id) => !dbCompetencyIds.has(id),
    ),
  };
}

function overlayCookieName(index: number) {
  return index === 0 ? OVERLAY_COOKIE : `${OVERLAY_COOKIE}_${index}`;
}

async function readOverlay(): Promise<DbOverlay | null> {
  try {
    const jar = await cookies();
    const parts: string[] = [];
    for (let index = 0; index < OVERLAY_MAX_CHUNKS; index += 1) {
      const part = jar.get(overlayCookieName(index))?.value;
      if (!part) break;
      parts.push(part);
    }
    if (parts.length === 0) return null;

    const json = inflateSync(Buffer.from(parts.join(""), "base64url")).toString(
      "utf8",
    );
    const parsed = JSON.parse(json) as DbOverlay;
    if (parsed?.v !== 1) return null;
    return parsed;
  } catch (error) {
    console.warn("Overlay cookie read failed:", error);
    return null;
  }
}

async function writeOverlay(overlay: DbOverlay): Promise<void> {
  const jar = await cookies();
  const compressed = deflateSync(
    Buffer.from(JSON.stringify(overlay), "utf8"),
  ).toString("base64url");

  const chunks: string[] = [];
  for (let index = 0; index < compressed.length; index += OVERLAY_CHUNK_SIZE) {
    chunks.push(compressed.slice(index, index + OVERLAY_CHUNK_SIZE));
  }

  if (chunks.length > OVERLAY_MAX_CHUNKS) {
    throw new Error(
      "Saved content is too large for browser session storage. Try fewer skillsets or a shorter summary.",
    );
  }

  for (let index = 0; index < OVERLAY_MAX_CHUNKS; index += 1) {
    jar.delete(overlayCookieName(index));
  }

  const secure =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL === "1" ||
    process.env.AUTH_URL?.startsWith("https://") === true;

  chunks.forEach((chunk, index) => {
    jar.set(overlayCookieName(index), chunk, {
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 180,
    });
  });
}

function getEdgeClient() {
  if (!EDGE_CONFIG_URL) return null;
  return createClient(EDGE_CONFIG_URL);
}

async function readFromEdgeConfig(): Promise<GeoSkillsDb | null> {
  try {
    const client = getEdgeClient();
    if (!client) return null;
    const value = await client.get<GeoSkillsDb>(EDGE_CONFIG_DB_KEY);
    if (isValidDb(value) && value.skillsets.length > 0) {
      return normalizeDb(cloneDb(value));
    }
  } catch (error) {
    console.warn("Edge Config read failed; using in-code seed.", error);
  }
  return null;
}

async function writeToEdgeConfig(db: GeoSkillsDb): Promise<boolean> {
  if (!EDGE_CONFIG_ID || !EDGE_CONFIG_WRITE_TOKEN) return false;
  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${EDGE_CONFIG_WRITE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              operation: "upsert",
              key: EDGE_CONFIG_DB_KEY,
              value: db,
            },
          ],
        }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      console.warn("Edge Config write failed:", response.status, body);
      return false;
    }
    return true;
  } catch (error) {
    console.warn("Edge Config write error:", error);
    return false;
  }
}

async function loadBaseDatabase(): Promise<GeoSkillsDb> {
  if (globalThis.__geoskillsMemoryBase) {
    return cloneDb(globalThis.__geoskillsMemoryBase);
  }

  const fromEdge = await readFromEdgeConfig();
  const base = fromEdge ?? normalizeDb(cloneDb(seedDatabase));
  globalThis.__geoskillsMemoryBase = base;
  return cloneDb(base);
}

export async function loadDatabase(): Promise<GeoSkillsDb> {
  const base = await loadBaseDatabase();
  const overlay = await readOverlay();
  return cloneDb(normalizeDb(applyOverlay(base, overlay)));
}

export async function saveDatabase(db: GeoSkillsDb): Promise<GeoSkillsDb> {
  const next = normalizeDb(cloneDb(db));
  // Cookie overlay survives across serverless instances for this browser.
  await writeOverlay(buildOverlay(next));
  // Optional shared store when a real write token is configured.
  const wroteShared = await writeToEdgeConfig(next);
  if (wroteShared) {
    globalThis.__geoskillsMemoryBase = next;
  }
  return cloneDb(next);
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
