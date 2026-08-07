import { Router } from "express";
import { gearController } from "./gear.controller";

const gearRouter = Router();

gearRouter.get("/", gearController.getAllGear);
gearRouter.get("/:id", gearController.getGearById);

export default gearRouter;
