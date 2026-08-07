import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { authController } from "./auth.controller";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/google", authController.googleLogin);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.get("/me", authenticate, authController.getMe);
authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
