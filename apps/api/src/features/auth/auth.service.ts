import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import type { LoginInput, LogoutInput, RefreshInput, RegisterInput } from './auth.schema';
import { prisma } from '../../lib/prisma';
import { env } from '../../env';
import { ErrorCode } from '../../constants/errorCodes';
import { AppError } from '../../lib/AppError';
import ms from 'ms';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION = '15m';

async function register(data: RegisterInput) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
        },
        omit: { password: true },
    });

    return user;
}

async function login(data: LoginInput) {
    const now = new Date();

    const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
            id: true,
            password: true,
            failedLoginAttempts: true,
            lockedUntil:  true,
        },
    });
    
    if (!user) {
        const fakePassword = '$2a$12$rjmA/MI0eb5tMdqnDZhKrO7CLKGxZ.dN6VaS2UY8mxODAPo6O46LC';
        await bcrypt.compare('senha', fakePassword);
        throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401);
    }

    if (user.lockedUntil && user.lockedUntil > now) {
        throw new AppError(ErrorCode.ACCOUNT_LOCKED, 400);
    }

    const passwordMatch = await bcrypt.compare(data.password, user.password)
    if (passwordMatch) {
        const accessToken = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ sub: user.id }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
        const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));
        
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failedLoginAttempts: 0,
                lockedUntil: null,
            }
        })

        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt,
            }
        });

        return { accessToken, refreshToken };
    }

    const failedLoginAttempts = user.failedLoginAttempts + 1;
    const lockedUntil = failedLoginAttempts >= MAX_FAILED_ATTEMPTS
        ? new Date(now.getTime() + ms(LOCK_DURATION))
        : null;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            failedLoginAttempts,
            lockedUntil,
        },
    });

    throw new AppError(ErrorCode.INVALID_CREDENTIALS, 401);
}

async function refresh(data: RefreshInput) {
    try {
        const payload = jwt.verify(data.refreshToken, env.JWT_REFRESH_SECRET);
    
        if (typeof payload === 'string' || !payload.sub) {
            throw new AppError(ErrorCode.REFRESH_TOKEN_INVALID, 401);
        }

        const token = await prisma.refreshToken.findUnique({
            where: { token: data.refreshToken },
        });

        if (!token) {
            throw new AppError(ErrorCode.REFRESH_TOKEN_INVALID, 401);
        }

        const accessToken = jwt.sign({ sub: payload.sub }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
        const refreshToken = jwt.sign({ sub: payload.sub }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN });
        const expiresAt = new Date(Date.now() + ms(env.JWT_REFRESH_EXPIRES_IN));

        await prisma.$transaction([
            prisma.refreshToken.delete({
                where: { token: data.refreshToken }
            }),

            prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    userId: payload.sub,
                    expiresAt,
                }
            }),
        ]);

        return { accessToken, refreshToken };
    } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError(ErrorCode.REFRESH_TOKEN_INVALID, 401)
    }
}

async function logout(data: LogoutInput) {
    try {
        await prisma.refreshToken.delete({
            where: { token: data.refreshToken },
        });
    } catch {
        throw new AppError(ErrorCode.REFRESH_TOKEN_INVALID, 401);
    }
}

export const authService = {
    register,
    login,
    refresh,
    logout
}