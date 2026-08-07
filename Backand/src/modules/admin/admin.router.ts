import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { adminController } from "./admin.controller";
import { categoryController } from "../category/category.controller";

const adminRouter = Router();

adminRouter.use(authenticate);
adminRouter.use(authorize(Role.ADMIN));

adminRouter.get("/users", adminController.getAllUsers);
adminRouter.patch("/users/:id", adminController.updateUserStatus);
adminRouter.get("/gear", adminController.getAllGear);
adminRouter.get("/rentals", adminController.getAllRentals);

adminRouter.post("/categories", categoryController.createCategory);
adminRouter.put("/categories/:id", categoryController.updateCategory);
adminRouter.delete("/categories/:id", categoryController.deleteCategory);

export default adminRouter;
