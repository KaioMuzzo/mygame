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

const refreshSchema = z.object({
    refreshToken: z.string().min(1),
})

export {
    registerSchema,
    loginSchema,
    refreshSchema
}

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;