import { Router } from "express";
import { register } from "./auth.controller";

const authRouter: Router = Router();

authRouter.post('/register', register);

export { authRouter };