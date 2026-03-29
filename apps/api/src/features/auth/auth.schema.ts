import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string().min(3).max(20).trim(),
    email: z.email().trim(),
    password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;