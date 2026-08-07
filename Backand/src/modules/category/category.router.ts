import { Router } from "express";
import { categoryController } from "./category.controller";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.get("/:id", categoryController.getCategoryById);

export default categoryRouter;
