import { z } from "zod";
import {
  ASSESSMENT_STRATEGIES,
  BLOOM_LEVELS,
  LEVELS,
  SESSION_KINDS,
} from "./utils";

const assessmentIds = ASSESSMENT_STRATEGIES.map((item) => item.id) as [
  (typeof ASSESSMENT_STRATEGIES)[number]["id"],
  ...(typeof ASSESSMENT_STRATEGIES)[number]["id"][],
];

const sessionSchema = z.object({
  kind: z.enum(SESSION_KINDS),
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(2000),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(15)
    .max(600)
    .optional()
    .nullable(),
});

export const skillsetFormSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(20).max(500),
  description: z.string().trim().min(40).max(5000),
  topicId: z.string().min(1),
  level: z.enum(LEVELS),
  estimatedHours: z.coerce.number().int().min(1).max(200).optional().nullable(),
  competencyIds: z.array(z.string().min(1)).min(1),
  newCompetencies: z
    .array(
      z.object({
        name: z.string().trim().min(3).max(160),
        category: z.string().trim().min(2).max(80),
        description: z.string().trim().max(500).optional().nullable(),
      }),
    )
    .max(8)
    .default([]),
  objectives: z.array(z.string().trim().min(10).max(500)).min(1).max(12),
  outcomes: z
    .array(
      z.object({
        statement: z.string().trim().min(10).max(500),
        bloomLevel: z.enum(BLOOM_LEVELS).optional().nullable(),
      }),
    )
    .min(1)
    .max(12),
  sessions: z.array(sessionSchema).min(1).max(24),
  assessmentStrategyIds: z.array(z.enum(assessmentIds)).min(1).max(10),
});

export type SkillsetFormValues = z.infer<typeof skillsetFormSchema>;

export const courseFormSchema = z.object({
  title: z.string().trim().min(3).max(200),
  code: z.string().trim().min(2).max(40),
  summary: z.string().trim().min(20).max(800),
  targetAudience: z.string().trim().min(10).max(400),
  skillsetIds: z.array(z.string().min(1)).min(2).max(12),
});

export type CourseFormValues = z.infer<typeof courseFormSchema>;
