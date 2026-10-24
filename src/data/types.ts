import { z } from 'zod';

export const SourceSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  verifiedAt: z.string(), // ISO date
  supports: z.array(z.string()),
});
export type Source = z.infer<typeof SourceSchema>;

export const ModuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  iconName: z.string(),
  color: z.string(),
  order: z.number(),
  // 'product' modules teach one Kaseya/Datto product; 'networking' modules
  // teach the general MSP networking fundamentals those products sit on.
  category: z.enum(['product', 'networking']).optional(),
  // Lesson text (light markdown: paragraphs, lists, **bold**, `code`).
  lessonSections: z.array(z.object({ title: z.string(), body: z.string() })).optional(),
  // Product learning experience fields
  problemSolved: z.string().optional(),
  mentalModel: z.string().optional(),
  keyTerminology: z.array(z.object({ term: z.string(), definition: z.string() })).optional(),
  actualUseCases: z.array(z.string()).optional(),
  commonWorkflows: z.array(z.string()).optional(),
  whenNotToUse: z.array(z.string()).optional(),
  relatedProducts: z.array(z.string()).optional(),
  commonConfusions: z.array(z.string()).optional(),
  sources: z.array(SourceSchema).optional(),
});
export type AppModule = z.infer<typeof ModuleSchema>;

export const FlashcardSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  question: z.string(),
  answer: z.string(),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

export const ScenarioStepSchema = z.object({
  id: z.string(),
  text: z.string(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean(),
    feedback: z.string(),
    nextStepId: z.string().optional(),
  })),
  competencyArea: z.enum(['knowledge', 'recognition', 'investigation', 'decisionMaking', 'procedure', 'documentation', 'retention']).optional(),
});
export type ScenarioStep = z.infer<typeof ScenarioStepSchema>;

export const ScenarioSchema = z.object({
  id: z.string(),
  moduleId: z.string(),
  title: z.string(),
  description: z.string(),
  firstStepId: z.string(),
  steps: z.record(z.string(), ScenarioStepSchema),
});
export type Scenario = z.infer<typeof ScenarioSchema>;

// LEARNING ENGINE SCHEMAS //////////////////////////////////////////

export const ConfidenceLevelSchema = z.union([
  z.literal('guessing'),
  z.literal('somewhat'),
  z.literal('confident'),
  z.literal('highly_confident'),
]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

export const ReviewRatingSchema = z.union([
  z.literal('again'),
  z.literal('hard'),
  z.literal('good'),
  z.literal('easy'),
]);
export type ReviewRating = z.infer<typeof ReviewRatingSchema>;

export const ReviewItemSchema = z.object({
  itemId: z.string(), // Links to a flashcard, scenario, mistake, or ticket
  itemType: z.union([z.literal('flashcard'), z.literal('scenario_decision'), z.literal('mistake_repair'), z.literal('ticket_case')]),
  moduleId: z.string(),
  firstSeen: z.string(), // ISO date
  lastReviewed: z.string().nullable(), // ISO date
  nextReviewDate: z.string(), // ISO date
  reviewCount: z.number(),
  successCount: z.number(),
  failureCount: z.number(),
  streak: z.number(),
  interval: z.number(), // SM-2 interval in days
  easeFactor: z.number(), // SM-2 ease factor
  difficulty: z.number(), // 0 to 1
  masteryEstimate: z.number(), // 0 to 100
  lastConfidence: ConfidenceLevelSchema.nullable(),
});
export type ReviewItem = z.infer<typeof ReviewItemSchema>;

export const MistakeSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date
  moduleId: z.string(),
  concept: z.string().optional(),
  activityType: z.union([z.literal('scenario'), z.literal('flashcard'), z.literal('shift')]),
  activityId: z.string().optional(),
  userAnswer: z.string(),
  expectedReasoning: z.string(),
  explanation: z.string(),
  confidenceBeforeAnswer: ConfidenceLevelSchema.nullable(),
  severity: z.union([z.literal('low'), z.literal('medium'), z.literal('high'), z.literal('critical')]),
  repairCount: z.number(),
  resolved: z.boolean(),
  relatedReviewItemId: z.string().optional(),
});
export type Mistake = z.infer<typeof MistakeSchema>;

export const RealTicketCaseSchema = z.object({
  id: z.string(),
  date: z.string(), // ISO date
  moduleId: z.string(),
  symptoms: z.string(),
  initialThought: z.string(),
  investigation: z.string(),
  resolution: z.string(),
  lessonsLearned: z.string(),
  fasterNextTime: z.string(),
});
export type RealTicketCase = z.infer<typeof RealTicketCaseSchema>;

export const ModuleCompetencySchema = z.object({
  knowledge: z.number(),       // What it does
  recognition: z.number(),     // When it's relevant
  investigation: z.number(),   // Finding evidence
  decisionMaking: z.number(),  // Sensible next action
  procedure: z.number(),       // Common sequences
  documentation: z.number(),   // Professional ticket notes
  retention: z.number(),       // Survives over weeks
});
export type ModuleCompetency = z.infer<typeof ModuleCompetencySchema>;

export const UserStateSchema = z.object({
  schemaVersion: z.number(), // For migrations
  xp: z.number(),
  completedScenarios: z.array(z.string()),
  competencies: z.record(z.string(), ModuleCompetencySchema), // Per moduleId
  reviewQueue: z.array(ReviewItemSchema),
  mistakeBank: z.array(MistakeSchema),
  ticketCases: z.array(RealTicketCaseSchema),
});
export type UserState = z.infer<typeof UserStateSchema>;
