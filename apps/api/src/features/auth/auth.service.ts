import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { LoginInput, RegisterInput } from './auth.schema';
import { prisma } from '../../lib/prisma';
import { env } from '../../env';
import { ErrorCode } from '../../constants/errorCodes';
import { AppError } from '../../lib/AppError';
import ms from 'ms';

async function register(data: RegisterInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

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

async function login(data: LoginInput) {
    const user = await prisma.user.findUnique({
        where: {
            email: data.email
        },
        select: {
            id: true,
            password: true
        },
    });

    if (!user) {
        const fakePassword = '$2a$12$rjmA/MI0eb5tMdqnDZhKrO7CLKGxZ.dN6VaS2UY8mxODAPo6O46LC';
        await bcrypt.compare('senha', fakePassword);
        throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401);
    }

    if (await bcrypt.compare(data.password, user.password)) {
        const accessToken = jwt.sign({ sub: user.id }, env['JWT_SECRET'], { expiresIn: env['JWT_EXPIRES_IN'] });
        const refreshToken = jwt.sign({ sub: user.id }, env['JWT_REFRESH_SECRET'], { expiresIn: env['JWT_REFRESH_EXPIRES_IN'] });
        const expiresAt = new Date(Date.now() + ms(env['JWT_REFRESH_EXPIRES_IN']));
        
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            }
        })

        return { accessToken, refreshToken };
    } else {
        throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401);
    }
}

export const authService = {
    register,
    login
}