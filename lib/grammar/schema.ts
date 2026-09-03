import { z } from "zod";

import { UD_RELATIONS, UPOS_TAGS } from "./types";

const edgeSchema = z.object({
  dependentId: z.string().min(1),
  headId: z.union([z.string().min(1), z.literal("ROOT")]),
  relation: z.enum(UD_RELATIONS),
  displayLabel: z.string().optional(),
  explanation: z.string().optional(),
});

const tokenSchema = z.object({
  id: z.string().min(1),
  index: z.number().int().positive(),
  form: z.string().min(1),
  lemma: z.string().optional(),
  upos: z.enum(UPOS_TAGS),
  xpos: z.string().optional(),
  start: z.number().int().nonnegative(),
  end: z.number().int().nonnegative(),
}).refine((token) => token.end >= token.start, { message: "end must be >= start", path: ["end"] });

export const sentenceAnalysisSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  language: z.literal("en"),
  tokens: z.array(tokenSchema).min(1),
  canonicalEdges: z.array(edgeSchema).min(1),
  acceptedAlternatives: z.array(z.array(edgeSchema)).optional(),
  concepts: z.array(z.string()),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  explanation: z.string().optional(),
  source: z.string().optional(),
  reviewer: z.string().optional(),
  reviewedAt: z.string().optional(),
  reviewStatus: z.enum(["draft", "reviewed", "published"]),
  schemaVersion: z.number().int().positive(),
});

export const lessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  profileId: z.string().min(1),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  sentences: z.array(sentenceAnalysisSchema).min(1),
});

export type LessonInput = z.infer<typeof lessonSchema>;

export function parseLesson(value: unknown): LessonInput {
  return lessonSchema.parse(value);
}
