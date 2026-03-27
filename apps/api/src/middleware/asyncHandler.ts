import type { NextFunction, Request, RequestHandler, Response } from "express";

function asyncHandler(fn: RequestHandler): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export { asyncHandler }