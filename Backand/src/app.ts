import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./config";
import globalErrorHandler from "./middlewares/globalErrorhandler";
import notFound from "./middlewares/notFound";

import authRouter from "./modules/auth/auth.routes";
import userRouter from "./modules/users/user.routers";
import categoryRouter from "./modules/category/category.router";
import gearRouter from "./modules/gear/gear.router";
import rentalRouter from "./modules/rental/rental.router";
import paymentRouter from "./modules/payment/payment.router";
import providerRouter from "./modules/provider/provider.router";
import adminRouter from "./modules/admin/admin.router";
import reviewRouter from "./modules/review/review.router";

const app: Application = express();

app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);

app.use("/api/payments/webhook/stripe", express.raw({ type: "application/json" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "GearUp API is running 🏋️",
    version: "1.0.0",
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "OK" });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/gear", gearRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/provider", providerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/reviews", reviewRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
