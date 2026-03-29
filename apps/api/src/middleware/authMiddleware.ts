import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../lib/AppError';
import { ErrorCode } from '../constants/errorCodes';
import jwt from 'jsonwebtoken';
import { env } from '../env';

function authMiddleware(req: Request, _res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new AppError(ErrorCode.MISSING_TOKEN, 401);
    }

    const token = authorization.split(' ')[1]!;

    try {
        const payload = jwt.verify(token, env.JWT_SECRET);

        if (typeof payload === 'string' || !payload.sub) {
            throw new AppError(ErrorCode.INVALID_TOKEN, 401);
        }

        req.userId = payload.sub;
        next();
    } catch {
        throw new AppError(ErrorCode.INVALID_TOKEN, 401);
    }
}

export { authMiddleware };