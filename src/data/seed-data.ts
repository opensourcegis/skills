import type { GeoSkillsDb, SessionItem, Skillset } from "./types";

const now = "2026-08-06T00:00:00.000Z";

function sessions(
  items: Omit<SessionItem, "id" | "sortOrder">[],
  prefix: string,
): SessionItem[] {
  return items.map((item, index) => ({
    ...item,
    id: `${prefix}-${index + 1}`,
    sortOrder: index,
  }));
}

export const seedDatabase: GeoSkillsDb = {
  topics: [
    {
      id: "topic-remote-sensing",
      name: "Remote Sensing",
      slug: "remote-sensing",
      description: "Earth observation, sensors, and image interpretation.",
    },
    {
      id: "topic-gis-analysis",
      name: "GIS Analysis",
      slug: "gis-analysis",
      description: "Spatial analysis, geoprocessing, and decision support.",
    },
    {
      id: "topic-cartography",
      name: "Cartography & Visualization",
      slug: "cartography-visualization",
      description: "Map design, visual communication, and interactive maps.",
    },
    {
      id: "topic-geodesy",
      name: "Geodesy & Positioning",
      slug: "geodesy-positioning",
      description: "Coordinate systems, GNSS, and surveying fundamentals.",
    },
    {
      id: "topic-spatial-ds",
      name: "Spatial Data Science",
      slug: "spatial-data-science",
      description: "Programming, data pipelines, and geospatial ML.",
    },
  ],
  competencies: [
    {
      id: "comp-raster",
      name: "Raster interpretation",
      slug: "raster-interpretation",
      category: "Remote Sensing",
      description: "Read spectral signatures and classify land cover.",
    },
    {
      id: "comp-vector",
      name: "Vector geoprocessing",
      slug: "vector-geoprocessing",
      category: "GIS",
      description: "Overlay, buffer, dissolve, and network operations.",
    },
    {
      id: "comp-crs",
      name: "Coordinate reference systems",
      slug: "coordinate-reference-systems",
      category: "Foundations",
      description: "Select, transform, and validate CRS choices.",
    },
    {
      id: "comp-map-design",
      name: "Map design",
      slug: "map-design",
      category: "Cartography",
      description: "Hierarchy, symbology, and audience-aware layouts.",
    },
    {
      id: "comp-spatial-stats",
      name: "Spatial statistics",
      slug: "spatial-statistics",
      category: "Analysis",
      description: "Pattern detection, clustering, and uncertainty.",
    },
    {
      id: "comp-field",
      name: "Field data collection",
      slug: "field-data-collection",
      category: "Methods",
      description: "GNSS, mobile GIS, and quality assurance in the field.",
    },
    {
      id: "comp-python",
      name: "Geospatial Python",
      slug: "geospatial-python",
      category: "Data Science",
      description: "Automate analysis with GeoPandas, rasterio, and related tools.",
    },
    {
      id: "comp-webgis",
      name: "Web GIS publishing",
      slug: "web-gis-publishing",
      category: "Systems",
      description: "Serve interactive maps and share reproducible workflows.",
    },
  ],
  skillsets: [
    {
      id: "skill-land-cover",
      title: "Land Cover Mapping with Multispectral Imagery",
      slug: "land-cover-mapping-with-multispectral-imagery",
      summary:
        "Plan and deliver a land-cover classification course module using optical satellite imagery.",
      description:
        "Faculty can use this skillset to scaffold a remote-sensing unit that moves from sensor basics to supervised classification and accuracy assessment.",
      topicId: "topic-remote-sensing",
      level: "intermediate",
      estimatedHours: 18,
      createdByEmail: "seed@geoskills.local",
      createdByName: "Curriculum Seed",
      createdAt: now,
      updatedAt: now,
      competencyIds: ["comp-raster", "comp-crs", "comp-spatial-stats"],
      objectives: [
        {
          id: "obj-lc-1",
          statement:
            "Explain spectral reflectance differences among common land-cover classes.",
          sortOrder: 0,
        },
        {
          id: "obj-lc-2",
          statement:
            "Design a classification workflow appropriate for regional monitoring.",
          sortOrder: 1,
        },
        {
          id: "obj-lc-3",
          statement:
            "Evaluate map accuracy with an independent validation sample.",
          sortOrder: 2,
        },
      ],
      outcomes: [
        {
          id: "out-lc-1",
          statement:
            "Produce a land-cover map with documented methods and accuracy metrics.",
          bloomLevel: "create",
          sortOrder: 0,
        },
        {
          id: "out-lc-2",
          statement:
            "Justify class definitions against stakeholder information needs.",
          bloomLevel: "evaluate",
          sortOrder: 1,
        },
        {
          id: "out-lc-3",
          statement:
            "Interpret confusion matrices and recommend improvements.",
          bloomLevel: "analyze",
          sortOrder: 2,
        },
      ],
      sessions: sessions(
        [
          {
            kind: "theory",
            title: "Sensors, bands, and spectral signatures",
            description:
              "Lecture on optical sensors, atmospheric effects, and class separability.",
            durationMinutes: 60,
          },
          {
            kind: "demo",
            title: "False-color and index workflows",
            description:
              "Instructor demo of NDVI and composite interpretation in GIS software.",
            durationMinutes: 45,
          },
          {
            kind: "exercise",
            title: "Signature exploration lab",
            description:
              "Compare NDVI and false-color composites for urban, cropland, and forest sites.",
            durationMinutes: 90,
          },
          {
            kind: "exercise",
            title: "Supervised classification project",
            description:
              "Train a classifier, validate with hold-out samples, and write a methods note.",
            durationMinutes: 180,
          },
        ],
        "sess-lc",
      ),
      assessmentStrategyIds: [
        "practical_lab_test",
        "project_portfolio",
        "rubric_assignment",
      ],
    },
    {
      id: "skill-suitability",
      title: "Site Suitability Analysis for Campus Planning",
      slug: "site-suitability-analysis-for-campus-planning",
      summary:
        "Introduce weighted overlay and multi-criteria evaluation for facilities or green-space siting.",
      description:
        "A compact skillset for first GIS courses combining criteria design with transparent suitability scoring.",
      topicId: "topic-gis-analysis",
      level: "beginner",
      estimatedHours: 12,
      createdByEmail: "seed@geoskills.local",
      createdByName: "Curriculum Seed",
      createdAt: now,
      updatedAt: now,
      competencyIds: ["comp-vector", "comp-map-design", "comp-crs"],
      objectives: [
        {
          id: "obj-su-1",
          statement: "Translate planning criteria into spatial layers and weights.",
          sortOrder: 0,
        },
        {
          id: "obj-su-2",
          statement: "Apply buffer, overlay, and reclassification tools correctly.",
          sortOrder: 1,
        },
        {
          id: "obj-su-3",
          statement: "Communicate suitability results with clear cartography.",
          sortOrder: 2,
        },
      ],
      outcomes: [
        {
          id: "out-su-1",
          statement:
            "Deliver a suitability map and criteria table for a campus scenario.",
          bloomLevel: "apply",
          sortOrder: 0,
        },
        {
          id: "out-su-2",
          statement:
            "Discuss trade-offs introduced by alternative weighting schemes.",
          bloomLevel: "evaluate",
          sortOrder: 1,
        },
      ],
      sessions: sessions(
        [
          {
            kind: "theory",
            title: "Multi-criteria decision making in GIS",
            description:
              "Introduce criteria scales, weights, and common suitability pitfalls.",
            durationMinutes: 50,
          },
          {
            kind: "demo",
            title: "Weighted overlay walkthrough",
            description:
              "Live demo building a simple suitability model with two weight sets.",
            durationMinutes: 40,
          },
          {
            kind: "exercise",
            title: "Criteria workshop",
            description:
              "In small groups, define criteria, scales, and weights for a proposed amenity.",
            durationMinutes: 60,
          },
          {
            kind: "exercise",
            title: "Weighted overlay lab",
            description:
              "Build the model, sensitivity-test two weight sets, and annotate the final map.",
            durationMinutes: 120,
          },
        ],
        "sess-su",
      ),
      assessmentStrategyIds: [
        "quiz_mcq",
        "presentation_viva",
        "continuous_assessment",
      ],
    },
    {
      id: "skill-python",
      title: "Reproducible Geospatial Workflows in Python",
      slug: "reproducible-geospatial-workflows-in-python",
      summary:
        "Teach faculty how to structure notebook-to-script geospatial pipelines for course projects.",
      description:
        "Focuses on reproducible analysis: project layout, CRS hygiene, vector/raster IO, and lightweight automation.",
      topicId: "topic-spatial-ds",
      level: "advanced",
      estimatedHours: 24,
      createdByEmail: "seed@geoskills.local",
      createdByName: "Curriculum Seed",
      createdAt: now,
      updatedAt: now,
      competencyIds: ["comp-python", "comp-spatial-stats", "comp-webgis"],
      objectives: [
        {
          id: "obj-py-1",
          statement:
            "Structure a geospatial analysis repository for classroom reuse.",
          sortOrder: 0,
        },
        {
          id: "obj-py-2",
          statement: "Automate common cleaning and CRS validation steps.",
          sortOrder: 1,
        },
        {
          id: "obj-py-3",
          statement:
            "Publish a lightweight interactive map from processed outputs.",
          sortOrder: 2,
        },
      ],
      outcomes: [
        {
          id: "out-py-1",
          statement:
            "Ship a documented notebook and script that regenerate key figures.",
          bloomLevel: "create",
          sortOrder: 0,
        },
        {
          id: "out-py-2",
          statement:
            "Diagnose CRS and geometry validity issues before analysis.",
          bloomLevel: "analyze",
          sortOrder: 1,
        },
      ],
      sessions: sessions(
        [
          {
            kind: "theory",
            title: "Reproducible geospatial project layout",
            description:
              "Cover environments, data folders, notebooks vs scripts, and CRS hygiene.",
            durationMinutes: 60,
          },
          {
            kind: "demo",
            title: "From messy notebook to modules",
            description:
              "Live refactor of a notebook into functions with schema assertions.",
            durationMinutes: 50,
          },
          {
            kind: "exercise",
            title: "Pipeline clinic",
            description:
              "Refactor a messy notebook into modular functions with assertions for CRS and schema.",
            durationMinutes: 150,
          },
          {
            kind: "exercise",
            title: "Mini map publish",
            description:
              "Export cleaned GeoJSON and embed an interactive map in a short faculty brief.",
            durationMinutes: 120,
          },
        ],
        "sess-py",
      ),
      assessmentStrategyIds: [
        "project_portfolio",
        "peer_assessment",
        "capstone_mini_project",
      ],
    },
    {
      id: "skill-gnss",
      title: "Field GNSS Collection for Course Basemaps",
      slug: "field-gnss-collection-for-course-basemaps",
      summary:
        "Plan outdoor labs that collect reliable GNSS points and lines for teaching basemaps.",
      description:
        "Covers mission planning, receiver settings, metadata, and QA so field days produce usable classroom datasets.",
      topicId: "topic-geodesy",
      level: "intermediate",
      estimatedHours: 10,
      createdByEmail: "seed@geoskills.local",
      createdByName: "Curriculum Seed",
      createdAt: now,
      updatedAt: now,
      competencyIds: ["comp-field", "comp-crs", "comp-map-design"],
      objectives: [
        {
          id: "obj-gn-1",
          statement:
            "Plan a field session with checkpoints and attribution standards.",
          sortOrder: 0,
        },
        {
          id: "obj-gn-2",
          statement:
            "Collect and post-process GNSS features with documented precision.",
          sortOrder: 1,
        },
        {
          id: "obj-gn-3",
          statement: "Integrate field features into a teaching basemap.",
          sortOrder: 2,
        },
      ],
      outcomes: [
        {
          id: "out-gn-1",
          statement:
            "Produce a QA checklist and cleaned field dataset for class reuse.",
          bloomLevel: "create",
          sortOrder: 0,
        },
        {
          id: "out-gn-2",
          statement:
            "Explain positional error sources affecting student maps.",
          bloomLevel: "understand",
          sortOrder: 1,
        },
      ],
      sessions: sessions(
        [
          {
            kind: "theory",
            title: "GNSS error sources and mission planning",
            description:
              "Discuss multipath, dilution of precision, and attribution standards.",
            durationMinutes: 45,
          },
          {
            kind: "demo",
            title: "Receiver setup and metadata capture",
            description:
              "Demo configuring a receiver/app and logging QA fields before going outside.",
            durationMinutes: 30,
          },
          {
            kind: "exercise",
            title: "Campus transect",
            description:
              "Collect waypoints along a transect and compare phone vs survey-grade accuracy if available.",
            durationMinutes: 120,
          },
          {
            kind: "exercise",
            title: "Basemap assembly",
            description:
              "Clean geometries, assign symbology, and publish a shared course basemap layer.",
            durationMinutes: 90,
          },
        ],
        "sess-gn",
      ),
      assessmentStrategyIds: [
        "field_report",
        "practical_lab_test",
        "continuous_assessment",
      ],
    },
  ] satisfies Skillset[],
  courses: [],
};
