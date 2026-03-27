import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_PORT: z.coerce.number().default(3306),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
});

export const env = envSchema.parse(process.env);