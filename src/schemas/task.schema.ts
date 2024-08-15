import { z } from 'zod';

export const taskSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().min(1),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
    }).transform((val) => new Date(val)),
});
