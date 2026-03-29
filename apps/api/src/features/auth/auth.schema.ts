import { z } from 'zod';

const registerSchema = z.object({
    username: z.string().min(3).max(20).trim(),
    email: z.email().trim(),
    password: z.string().min(8),
});

const loginSchema = z.object({
    email: z.email().trim(),
    password: z.string().min(8),
});

export { registerSchema, loginSchema }

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;