import { Router } from "express";
import { register } from "./auth.controller";
import { authLimiter } from "../../middleware/rateLimiter";

const authRouter: Router = Router();

authRouter.post('/register', authLimiter, register);

export { authRouter };