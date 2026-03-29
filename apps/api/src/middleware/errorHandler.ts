import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../env";
import { ErrorCode } from "../constants/errorCodes";
import { AppError } from "../lib/AppError";

interface DriverAdapterMeta {
    cause?: {
        constraint?: {
            index?: string;
        };
    };
}

function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
    if (err instanceof ZodError) {
        const errors = Object.fromEntries(
            err.issues.map(issue => [issue.path[0], issue.message])
        );
        return res.status(400).json({ errors });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const meta = err.meta?.driverAdapterError as DriverAdapterMeta | undefined;
        const index = meta?.cause?.constraint?.index;
        
        if (env['NODE_ENV'] === 'development') {
            console.error('[P2002] constraint index:', index);
        }

        if (index?.includes('username')) {
            return res.status(409).json({ code: ErrorCode.USERNAME_ALREADY_IN_USE });
        }

        if (index?.includes('email')) {
            return res.status(409).json({ code: ErrorCode.EMAIL_ALREADY_IN_USE });
        }


        return res.status(409).json({ code: ErrorCode.UNIQUE_CONSTRAINT_VIOLATION });
    }

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ code: err.message });
    }

    console.error(err);
    res.status(500).json({ code: ErrorCode.INTERNAL_SERVER_ERROR });
}

export { errorHandler }