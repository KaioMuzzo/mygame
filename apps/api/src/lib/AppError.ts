import type { ErrorCode } from '../constants/errorCodes';

class AppError extends Error {
    statusCode: number;

    constructor(message: ErrorCode, statusCode: number) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        this.statusCode = statusCode;
    }
}

export { AppError }