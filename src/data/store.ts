import type { Db } from "mongodb";
import { seedDatabase } from "@/data/seed-data";
import type {
  AssessmentStrategyId,
  GeoSkillsDb,
  SessionItem,
  Skillset,
} from "@/data/types";
import { getMongoUri, MONGO_DB_NAME, MONGO_STATE_ID } from "@/lib/config";
import client, { requireMongoClient } from "@/lib/mongodb";

declare global {
  // eslint-disable-next-line no-var
  var __geoskillsMemoryDb: GeoSkillsDb | undefined;
}

const STATE_COLLECTION = "app_state";

type StoredState = GeoSkillsDb & {
  _id: string;
  updatedAt?: string;
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

function fromStored(doc: StoredState): GeoSkillsDb {
  return normalizeDb({
    topics: doc.topics,
    competencies: doc.competencies,
    skillsets: doc.skillsets,
    courses: doc.courses,
  });
}

function getDb(): Db {
  return requireMongoClient().db(MONGO_DB_NAME);
}

async function readFromMongo(): Promise<GeoSkillsDb | null> {
  const db = getDb();
  const doc = (await db
    .collection<StoredState>(STATE_COLLECTION)
    .findOne({ _id: MONGO_STATE_ID })) as StoredState | null;

  if (!doc || !isValidDb(doc) || doc.skillsets.length === 0) {
    return null;
  }
  return fromStored(doc);
}

async function writeToMongo(data: GeoSkillsDb): Promise<void> {
  const db = getDb();
  const payload: StoredState = {
    _id: MONGO_STATE_ID,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db
    .collection<StoredState>(STATE_COLLECTION)
    .replaceOne({ _id: MONGO_STATE_ID }, payload, { upsert: true });
}

export async function loadDatabase(): Promise<GeoSkillsDb> {
  if (globalThis.__geoskillsMemoryDb) {
    return cloneDb(normalizeDb(globalThis.__geoskillsMemoryDb));
  }

  // Local/dev without Mongo: serve in-code seed only (writes will fail clearly).
  if (!client || !getMongoUri()) {
    const seeded = normalizeDb(cloneDb(seedDatabase));
    globalThis.__geoskillsMemoryDb = seeded;
    return cloneDb(seeded);
  }

  try {
    const fromMongo = await readFromMongo();
    if (fromMongo) {
      globalThis.__geoskillsMemoryDb = fromMongo;
      return cloneDb(fromMongo);
    }

    const seeded = normalizeDb(cloneDb(seedDatabase));
    await writeToMongo(seeded);
    globalThis.__geoskillsMemoryDb = seeded;
    return cloneDb(seeded);
  } catch (error) {
    console.error("MongoDB load failed:", error);
    throw new Error(
      "Could not connect to MongoDB. Check geospatialskills_storage_MONGODB_URI and Atlas network access.",
    );
  }
}

export async function saveDatabase(db: GeoSkillsDb): Promise<GeoSkillsDb> {
  const next = normalizeDb(cloneDb(db));
  globalThis.__geoskillsMemoryDb = next;

  if (!client || !getMongoUri()) {
    throw new Error(
      "MongoDB is not configured. Set geospatialskills_storage_MONGODB_URI in Vercel, then redeploy.",
    );
  }

  try {
    await writeToMongo(next);
  } catch (error) {
    console.error("MongoDB save failed:", error);
    throw new Error(
      "Could not save to MongoDB. Check geospatialskills_storage_MONGODB_URI and try again.",
    );
  }

  return cloneDb(next);
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
