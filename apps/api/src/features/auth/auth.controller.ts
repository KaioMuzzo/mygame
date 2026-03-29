import { loginSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { asyncHandler } from "../../middleware/asyncHandler";
import type { RequestHandler } from "express";

const register: RequestHandler = asyncHandler(async (req, res) => {
    const body = registerSchema.parse(req.body);
    const user = await authService.register(body);
    res.status(201).json(user);
});

const login: RequestHandler = asyncHandler(async (req, res) => {
    const body = loginSchema.parse(req.body);
    const user = await authService.login(body);
    res.status(200).json(user);
});

export {
    register,
    login
}