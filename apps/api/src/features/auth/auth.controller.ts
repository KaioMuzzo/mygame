import type { Request, Response } from "express";
import { registerSchema } from "./auth.schema";
import { authService } from "./auth.service";

async function register(req: Request, res: Response) {
    const body = registerSchema.parse(req.body);
    const user = await authService.register(body);
    res.status(201).json(user);
}

export { register }