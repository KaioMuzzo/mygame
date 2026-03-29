import { Router } from "express";
import { login, logout, refresh, register } from "./auth.controller";
import { authLimiter } from "../../middleware/rateLimiter";

const authRouter: Router = Router();

authRouter.post('/register', authLimiter, register);
authRouter.post('/login', authLimiter, login);
authRouter.post('/refresh', authLimiter, refresh);
authRouter.post('/logout', authLimiter, logout);

export { authRouter };