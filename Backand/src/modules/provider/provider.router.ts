import { Router } from "express";
import { Role } from "../../../prisma/generated/prisma";
import { authenticate, authorize } from "../../middlewares/auth";
import { providerController } from "./provider.controller";

const providerRouter = Router();

providerRouter.use(authenticate);
providerRouter.use(authorize(Role.PROVIDER));

providerRouter.post("/gear", providerController.createGear);
providerRouter.get("/gear", providerController.getMyGear);
providerRouter.put("/gear/:id", providerController.updateGear);
providerRouter.delete("/gear/:id", providerController.deleteGear);
providerRouter.get("/orders", providerController.getProviderOrders);
providerRouter.patch("/orders/:id", providerController.updateOrderStatus);

export default providerRouter;
