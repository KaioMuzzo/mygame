import { registerSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { asyncHandler } from "../../middleware/asyncHandler";
import type { RequestHandler } from "express";

const register: RequestHandler = asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const user = await authService.register(body);
    res.status(201).json(user);
});

export { register }