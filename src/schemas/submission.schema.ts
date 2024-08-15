import { z } from 'zod';

export const submissionSchema = z.object({
  student: z.string().length(24),
  task: z.string().length(24),
  fileUrl: z.string(),
  submittedAt: z.date().optional(),
  graded: z.boolean()
});
