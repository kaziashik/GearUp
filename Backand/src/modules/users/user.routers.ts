import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { userController } from "./user.controller";

const userRouter = Router();

userRouter.use(authenticate);

userRouter.get("/profile", userController.getMyProfile);
userRouter.patch("/profile", userController.updateMyProfile);
userRouter.patch("/change-password", userController.changePassword);
userRouter.delete("/account", userController.deleteAccount);

export default userRouter;
