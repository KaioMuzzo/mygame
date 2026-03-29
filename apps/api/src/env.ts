import { z } from 'zod';
import type { StringValue } from 'ms';

const expiresValidate = z.custom<StringValue>((val) => typeof val === 'string' && /^\d+\s?(ms|s|m|h|d|w|y)$/.test(val));

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    DATABASE_HOST: z.string().min(1),
    DATABASE_PORT: z.coerce.number().default(3306),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_IN: expiresValidate,
    JWT_REFRESH_SECRET: z.string().min(1),
    JWT_REFRESH_EXPIRES_IN: expiresValidate,
});

export const env = envSchema.parse(process.env);