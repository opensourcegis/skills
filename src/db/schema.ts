import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const topics = pgTable("topics", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const competencies = pgTable("competencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 160 }).notNull().unique(),
  slug: varchar("slug", { length: 180 }).notNull().unique(),
  category: varchar("category", { length: 80 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const skillsets = pgTable("skillsets", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  summary: text("summary").notNull(),
  description: text("description").notNull(),
  topicId: uuid("topic_id")
    .notNull()
    .references(() => topics.id, { onDelete: "restrict" }),
  level: varchar("level", { length: 32 }).notNull().default("intermediate"),
  estimatedHours: integer("estimated_hours"),
  createdByEmail: varchar("created_by_email", { length: 255 }).notNull(),
  createdByName: varchar("created_by_name", { length: 160 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const skillsetCompetencies = pgTable(
  "skillset_competencies",
  {
    skillsetId: uuid("skillset_id")
      .notNull()
      .references(() => skillsets.id, { onDelete: "cascade" }),
    competencyId: uuid("competency_id")
      .notNull()
      .references(() => competencies.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.skillsetId, table.competencyId] })],
);

export const objectives = pgTable("objectives", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillsetId: uuid("skillset_id")
    .notNull()
    .references(() => skillsets.id, { onDelete: "cascade" }),
  statement: text("statement").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const outcomes = pgTable("outcomes", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillsetId: uuid("skillset_id")
    .notNull()
    .references(() => skillsets.id, { onDelete: "cascade" }),
  statement: text("statement").notNull(),
  bloomLevel: varchar("bloom_level", { length: 40 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const exercises = pgTable("exercises", {
  id: uuid("id").defaultRandom().primaryKey(),
  skillsetId: uuid("skillset_id")
    .notNull()
    .references(() => skillsets.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  exerciseType: varchar("exercise_type", { length: 60 })
    .notNull()
    .default("lab"),
  durationMinutes: integer("duration_minutes"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const topicsRelations = relations(topics, ({ many }) => ({
  skillsets: many(skillsets),
}));

export const competenciesRelations = relations(competencies, ({ many }) => ({
  skillsetLinks: many(skillsetCompetencies),
}));

export const skillsetsRelations = relations(skillsets, ({ one, many }) => ({
  topic: one(topics, {
    fields: [skillsets.topicId],
    references: [topics.id],
  }),
  competencyLinks: many(skillsetCompetencies),
  objectives: many(objectives),
  outcomes: many(outcomes),
  exercises: many(exercises),
}));

export const skillsetCompetenciesRelations = relations(
  skillsetCompetencies,
  ({ one }) => ({
    skillset: one(skillsets, {
      fields: [skillsetCompetencies.skillsetId],
      references: [skillsets.id],
    }),
    competency: one(competencies, {
      fields: [skillsetCompetencies.competencyId],
      references: [competencies.id],
    }),
  }),
);

export const objectivesRelations = relations(objectives, ({ one }) => ({
  skillset: one(skillsets, {
    fields: [objectives.skillsetId],
    references: [skillsets.id],
  }),
}));

export const outcomesRelations = relations(outcomes, ({ one }) => ({
  skillset: one(skillsets, {
    fields: [outcomes.skillsetId],
    references: [skillsets.id],
  }),
}));

export const exercisesRelations = relations(exercises, ({ one }) => ({
  skillset: one(skillsets, {
    fields: [exercises.skillsetId],
    references: [skillsets.id],
  }),
}));

export type Topic = typeof topics.$inferSelect;
export type Competency = typeof competencies.$inferSelect;
export type Skillset = typeof skillsets.$inferSelect;
export type Objective = typeof objectives.$inferSelect;
export type Outcome = typeof outcomes.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
