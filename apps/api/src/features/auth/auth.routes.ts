import { Router } from "express";
import { login, logout, refresh, register } from "./auth.controller";
import { loginLimiter, registerLimiter } from "../../middleware/rateLimiter";


const authRouter: Router = Router();

authRouter.post('/register', registerLimiter, register);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/refresh', refresh);
authRouter.post('/logout', logout);

export { authRouter };