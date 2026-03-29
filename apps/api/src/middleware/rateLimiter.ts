import rateLimit from "express-rate-limit"
import { ErrorCode } from "../constants/errorCodes"

const globalLimiter = rateLimit ({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { code: ErrorCode.TOO_MANY_REQUESTS },
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { code: ErrorCode.TOO_MANY_REQUESTS },
});


export {
    globalLimiter,
    authLimiter
}