import { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../env";

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
        res.status(400).json({ errors });
        return;
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        const meta = err.meta?.driverAdapterError as DriverAdapterMeta | undefined;
        const index = meta?.cause?.constraint?.index;
        
        if (env['NODE_ENV'] === 'development') {
            console.error('[P2002] constraint index:', index);
        }

        if (index?.includes('username')) {
            res.status(409).json({ code: 'USERNAME_ALREADY_IN_USE' });
            return;
        }

        if (index?.includes('email')) {
            res.status(409).json({ code: 'EMAIL_ALREADY_IN_USE' });
            return;
        }


        res.status(409).json({ code: 'UNIQUE_CONSTRAINT_VIOLATION' });
        return;
    }

    console.error(err);
    res.status(500).json({ code: 'INTERNAL_SERVER_ERROR' });
}

export { errorHandler }