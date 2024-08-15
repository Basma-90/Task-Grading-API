import { z } from 'zod';

export const gradeSchema = z.object({
  submission: z.string().length(24),
  grader: z.string().length(24).optional(),
  grade: z.number().min(0).max(100),
  feedback: z.string().optional(),
  gradedAt: z.date()
});
