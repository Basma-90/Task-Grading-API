import {z} from 'zod';

export const userSchema = z.object(
    {
        name: z.string().min(1).max(255),
        email: z.string().email(),
        password: z.string().min(8).max(255),
        role: z.string().min(1).max(255),
        refreshToken: z.string().optional(),
    }
)


