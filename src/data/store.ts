import { createClient } from "@vercel/edge-config";
import { seedDatabase } from "@/data/seed-data";
import type { GeoSkillsDb } from "@/data/types";
import {
  EDGE_CONFIG_DB_KEY,
  EDGE_CONFIG_ID,
  EDGE_CONFIG_TOKEN,
  EDGE_CONFIG_URL,
} from "@/lib/config";

declare global {
  // eslint-disable-next-line no-var
  var __geoskillsMemoryDb: GeoSkillsDb | undefined;
}

function cloneDb(db: GeoSkillsDb): GeoSkillsDb {
  return structuredClone(db);
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

function getEdgeClient() {
  return createClient(EDGE_CONFIG_URL);
}

async function readFromEdgeConfig(): Promise<GeoSkillsDb | null> {
  try {
    const client = getEdgeClient();
    const value = await client.get<GeoSkillsDb>(EDGE_CONFIG_DB_KEY);
    if (isValidDb(value) && value.skillsets.length > 0) {
      return cloneDb(value);
    }
  } catch (error) {
    console.warn("Edge Config read failed; using in-code seed.", error);
  }
  return null;
}

async function writeToEdgeConfig(db: GeoSkillsDb): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${EDGE_CONFIG_TOKEN}`,
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

export async function loadDatabase(): Promise<GeoSkillsDb> {
  if (globalThis.__geoskillsMemoryDb) {
    return cloneDb(globalThis.__geoskillsMemoryDb);
  }

  const fromEdge = await readFromEdgeConfig();
  if (fromEdge) {
    globalThis.__geoskillsMemoryDb = fromEdge;
    return cloneDb(fromEdge);
  }

  const seeded = cloneDb(seedDatabase);
  globalThis.__geoskillsMemoryDb = seeded;
  // Best-effort seed into Edge Config for later deploys/instances.
  void writeToEdgeConfig(seeded);
  return cloneDb(seeded);
}

export async function saveDatabase(db: GeoSkillsDb): Promise<GeoSkillsDb> {
  const next = cloneDb(db);
  globalThis.__geoskillsMemoryDb = next;
  await writeToEdgeConfig(next);
  return cloneDb(next);
}

export async function databaseReady() {
  try {
    const db = await loadDatabase();
    return db.skillsets.length > 0 || db.topics.length > 0;
  } catch {
    return false;
  }
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}
