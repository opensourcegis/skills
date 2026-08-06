import { z } from "zod";
import { BLOOM_LEVELS, EXERCISE_TYPES, LEVELS } from "./utils";

export const skillsetFormSchema = z.object({
  title: z.string().trim().min(3).max(200),
  summary: z.string().trim().min(20).max(500),
  description: z.string().trim().min(40).max(5000),
  topicId: z.string().uuid(),
  level: z.enum(LEVELS),
  estimatedHours: z.coerce.number().int().min(1).max(200).optional().nullable(),
  competencyIds: z.array(z.string().uuid()).min(1),
  objectives: z
    .array(z.string().trim().min(10).max(500))
    .min(1)
    .max(12),
  outcomes: z
    .array(
      z.object({
        statement: z.string().trim().min(10).max(500),
        bloomLevel: z.enum(BLOOM_LEVELS).optional().nullable(),
      }),
    )
    .min(1)
    .max(12),
  exercises: z
    .array(
      z.object({
        title: z.string().trim().min(3).max(200),
        description: z.string().trim().min(10).max(2000),
        exerciseType: z.enum(EXERCISE_TYPES),
        durationMinutes: z.coerce
          .number()
          .int()
          .min(15)
          .max(600)
          .optional()
          .nullable(),
      }),
    )
    .min(1)
    .max(12),
});

export type SkillsetFormValues = z.infer<typeof skillsetFormSchema>;
