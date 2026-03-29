import rateLimit from "express-rate-limit"
import { ErrorCode } from "../constants/errorCodes"

const globalLimiter = rateLimit ({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { code: ErrorCode.TOO_MANY_REQUESTS },
});

const loginLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { code: ErrorCode.TOO_MANY_REQUESTS },
});

const registerLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { code: ErrorCode.TOO_MANY_REQUESTS },
});

export {
    globalLimiter,
    loginLimiter,
    registerLimiter
}