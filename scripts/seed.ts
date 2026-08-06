import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import {
  competencies,
  exercises,
  objectives,
  outcomes,
  skillsetCompetencies,
  skillsets,
  topics,
} from "../src/db/schema";
import { slugify } from "../src/lib/utils";

const topicSeed = [
  {
    name: "Remote Sensing",
    description: "Earth observation, sensors, and image interpretation.",
  },
  {
    name: "GIS Analysis",
    description: "Spatial analysis, geoprocessing, and decision support.",
  },
  {
    name: "Cartography & Visualization",
    description: "Map design, visual communication, and interactive maps.",
  },
  {
    name: "Geodesy & Positioning",
    description: "Coordinate systems, GNSS, and surveying fundamentals.",
  },
  {
    name: "Spatial Data Science",
    description: "Programming, data pipelines, and geospatial ML.",
  },
];

const competencySeed = [
  {
    name: "Raster interpretation",
    category: "Remote Sensing",
    description: "Read spectral signatures and classify land cover.",
  },
  {
    name: "Vector geoprocessing",
    category: "GIS",
    description: "Overlay, buffer, dissolve, and network operations.",
  },
  {
    name: "Coordinate reference systems",
    category: "Foundations",
    description: "Select, transform, and validate CRS choices.",
  },
  {
    name: "Map design",
    category: "Cartography",
    description: "Hierarchy, symbology, and audience-aware layouts.",
  },
  {
    name: "Spatial statistics",
    category: "Analysis",
    description: "Pattern detection, clustering, and uncertainty.",
  },
  {
    name: "Field data collection",
    category: "Methods",
    description: "GNSS, mobile GIS, and quality assurance in the field.",
  },
  {
    name: "Geospatial Python",
    category: "Data Science",
    description: "Automate analysis with GeoPandas, rasterio, and related tools.",
  },
  {
    name: "Web GIS publishing",
    category: "Systems",
    description: "Serve interactive maps and share reproducible workflows.",
  },
];

const skillsetSeed = [
  {
    title: "Land Cover Mapping with Multispectral Imagery",
    topic: "Remote Sensing",
    level: "intermediate",
    estimatedHours: 18,
    summary:
      "Plan and deliver a land-cover classification course module using optical satellite imagery.",
    description:
      "Faculty can use this skillset to scaffold a remote-sensing unit that moves from sensor basics to supervised classification and accuracy assessment. Emphasis is on defensible class schemas and interpretation for environmental planning.",
    competencies: ["Raster interpretation", "Coordinate reference systems", "Spatial statistics"],
    objectives: [
      "Explain spectral reflectance differences among common land-cover classes.",
      "Design a classification workflow appropriate for regional monitoring.",
      "Evaluate map accuracy with an independent validation sample.",
    ],
    outcomes: [
      {
        statement: "Produce a land-cover map with documented methods and accuracy metrics.",
        bloomLevel: "create",
      },
      {
        statement: "Justify class definitions against stakeholder information needs.",
        bloomLevel: "evaluate",
      },
      {
        statement: "Interpret confusion matrices and recommend improvements.",
        bloomLevel: "analyze",
      },
    ],
    exercises: [
      {
        title: "Signature exploration lab",
        description:
          "Compare NDVI and false-color composites for urban, cropland, and forest sites.",
        exerciseType: "lab",
        durationMinutes: 90,
      },
      {
        title: "Supervised classification project",
        description:
          "Train a classifier, validate with hold-out samples, and write a one-page methods note.",
        exerciseType: "project",
        durationMinutes: 180,
      },
    ],
  },
  {
    title: "Site Suitability Analysis for Campus Planning",
    topic: "GIS Analysis",
    level: "beginner",
    estimatedHours: 12,
    summary:
      "Introduce weighted overlay and multi-criteria evaluation for facilities or green-space siting.",
    description:
      "A compact skillset for first GIS courses. Students combine slope, access, land use, and environmental constraints into transparent suitability scores suitable for planning studios.",
    competencies: ["Vector geoprocessing", "Map design", "Coordinate reference systems"],
    objectives: [
      "Translate planning criteria into spatial layers and weights.",
      "Apply buffer, overlay, and reclassification tools correctly.",
      "Communicate suitability results with clear cartography.",
    ],
    outcomes: [
      {
        statement: "Deliver a suitability map and criteria table for a campus scenario.",
        bloomLevel: "apply",
      },
      {
        statement: "Discuss trade-offs introduced by alternative weighting schemes.",
        bloomLevel: "evaluate",
      },
    ],
    exercises: [
      {
        title: "Criteria workshop",
        description:
          "In small groups, define criteria, scales, and weights for a proposed amenity.",
        exerciseType: "discussion",
        durationMinutes: 60,
      },
      {
        title: "Weighted overlay lab",
        description:
          "Build the model, sensitivity-test two weight sets, and annotate the final map.",
        exerciseType: "lab",
        durationMinutes: 120,
      },
    ],
  },
  {
    title: "Reproducible Geospatial Workflows in Python",
    topic: "Spatial Data Science",
    level: "advanced",
    estimatedHours: 24,
    summary:
      "Teach faculty how to structure notebook-to-script geospatial pipelines for course projects.",
    description:
      "Focuses on reproducible analysis: project layout, CRS hygiene, vector/raster IO, and lightweight automation for recurring student datasets.",
    competencies: ["Geospatial Python", "Spatial statistics", "Web GIS publishing"],
    objectives: [
      "Structure a geospatial analysis repository for classroom reuse.",
      "Automate common cleaning and CRS validation steps.",
      "Publish a lightweight interactive map from processed outputs.",
    ],
    outcomes: [
      {
        statement: "Ship a documented notebook and script that regenerate key figures.",
        bloomLevel: "create",
      },
      {
        statement: "Diagnose CRS and geometry validity issues before analysis.",
        bloomLevel: "analyze",
      },
    ],
    exercises: [
      {
        title: "Pipeline clinic",
        description:
          "Refactor a messy notebook into modular functions with assertions for CRS and schema.",
        exerciseType: "lab",
        durationMinutes: 150,
      },
      {
        title: "Mini map publish",
        description:
          "Export cleaned GeoJSON and embed an interactive map in a short faculty brief.",
        exerciseType: "project",
        durationMinutes: 120,
      },
    ],
  },
  {
    title: "Field GNSS Collection for Course Basemaps",
    topic: "Geodesy & Positioning",
    level: "intermediate",
    estimatedHours: 10,
    summary:
      "Plan outdoor labs that collect reliable GNSS points and lines for teaching basemaps.",
    description:
      "Covers mission planning, receiver settings, metadata, and QA so field days produce usable classroom datasets rather than noisy tracks.",
    competencies: ["Field data collection", "Coordinate reference systems", "Map design"],
    objectives: [
      "Plan a field session with checkpoints and attribution standards.",
      "Collect and post-process GNSS features with documented precision.",
      "Integrate field features into a teaching basemap.",
    ],
    outcomes: [
      {
        statement: "Produce a QA checklist and cleaned field dataset for class reuse.",
        bloomLevel: "create",
      },
      {
        statement: "Explain positional error sources affecting student maps.",
        bloomLevel: "understand",
      },
    ],
    exercises: [
      {
        title: "Campus transect",
        description:
          "Collect waypoints along a transect, record metadata, and compare phone vs survey-grade accuracy if available.",
        exerciseType: "fieldwork",
        durationMinutes: 120,
      },
      {
        title: "Basemap assembly",
        description:
          "Clean geometries, assign symbology, and publish a shared course basemap layer.",
        exerciseType: "lab",
        durationMinutes: 90,
      },
    ],
  },
];

async function upsertTopic(
  db: ReturnType<typeof getDb>,
  name: string,
  description: string,
) {
  const slug = slugify(name);
  const existing = await db.select().from(topics).where(eq(topics.slug, slug)).limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db
    .insert(topics)
    .values({ name, slug, description })
    .returning();
  return created;
}

async function upsertCompetency(
  db: ReturnType<typeof getDb>,
  name: string,
  category: string,
  description: string,
) {
  const slug = slugify(name);
  const existing = await db
    .select()
    .from(competencies)
    .where(eq(competencies.slug, slug))
    .limit(1);
  if (existing[0]) return existing[0];
  const [created] = await db
    .insert(competencies)
    .values({ name, slug, category, description })
    .returning();
  return created;
}

async function main() {
  const db = getDb();

  const topicMap = new Map<string, string>();
  for (const topic of topicSeed) {
    const row = await upsertTopic(db, topic.name, topic.description);
    topicMap.set(topic.name, row.id);
  }

  const competencyMap = new Map<string, string>();
  for (const competency of competencySeed) {
    const row = await upsertCompetency(
      db,
      competency.name,
      competency.category,
      competency.description,
    );
    competencyMap.set(competency.name, row.id);
  }

  for (const skill of skillsetSeed) {
    const slug = slugify(skill.title);
    const existing = await db
      .select()
      .from(skillsets)
      .where(eq(skillsets.slug, slug))
      .limit(1);

    let skillsetId = existing[0]?.id;
    if (!skillsetId) {
      const [created] = await db
        .insert(skillsets)
        .values({
          title: skill.title,
          slug,
          summary: skill.summary,
          description: skill.description,
          topicId: topicMap.get(skill.topic)!,
          level: skill.level,
          estimatedHours: skill.estimatedHours,
          createdByEmail: "seed@geoskills.local",
          createdByName: "Curriculum Seed",
        })
        .returning();
      skillsetId = created.id;
    }

    await db
      .delete(skillsetCompetencies)
      .where(eq(skillsetCompetencies.skillsetId, skillsetId));
    await db.delete(objectives).where(eq(objectives.skillsetId, skillsetId));
    await db.delete(outcomes).where(eq(outcomes.skillsetId, skillsetId));
    await db.delete(exercises).where(eq(exercises.skillsetId, skillsetId));

    await db.insert(skillsetCompetencies).values(
      skill.competencies.map((name) => ({
        skillsetId: skillsetId!,
        competencyId: competencyMap.get(name)!,
      })),
    );

    await db.insert(objectives).values(
      skill.objectives.map((statement, index) => ({
        skillsetId: skillsetId!,
        statement,
        sortOrder: index,
      })),
    );

    await db.insert(outcomes).values(
      skill.outcomes.map((outcome, index) => ({
        skillsetId: skillsetId!,
        statement: outcome.statement,
        bloomLevel: outcome.bloomLevel,
        sortOrder: index,
      })),
    );

    await db.insert(exercises).values(
      skill.exercises.map((exercise, index) => ({
        skillsetId: skillsetId!,
        title: exercise.title,
        description: exercise.description,
        exerciseType: exercise.exerciseType,
        durationMinutes: exercise.durationMinutes,
        sortOrder: index,
      })),
    );
  }

  console.log("Seeded geospatial skillsets, competencies, and topics.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
