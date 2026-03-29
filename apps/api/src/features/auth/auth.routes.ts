import { Router } from "express";
import { login, register } from "./auth.controller";
import { authLimiter } from "../../middleware/rateLimiter";

const authRouter: Router = Router();

authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);

export { authRouter };