import bcrypt from 'bcrypt';
import type { RegisterInput } from "./auth.schema";
import { prisma } from '../../lib/prisma';

async function register(data: RegisterInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        omit: {
            password: true,
        },
    });

    return user;
}

export const authService = { register }