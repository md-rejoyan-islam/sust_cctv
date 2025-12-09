import { Request, Response, Router } from "express";
import createHttpError from "http-errors";
import CameraController from "../controllers/camera.controller";
import errorHandler from "../middlewares/error-handler";
import validate from "../middlewares/validate";
import { validateHeaders } from "../middlewares/validate-headers";
import { successResponse } from "../utils/response-handler";
import CameraValidator from "../validator/camera.validator";
import authRouter from "./auth.route";
import cameraRouter from "./camera.route";
import userRouter from "./user.route";
import zoneRouter from "./zone.route";

const router = Router();

// home route
router.get("/", (_req, res) => {
  successResponse(res, {
    statusCode: 200,
    message: "SUST CCTV Server is running...",
  });
});

// health check route
router.get("/health", (_req: Request, res: Response) => {
  successResponse(res, {
    statusCode: 200,
    message: "API is healthy",
    payload: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

// favicon route
router.get("/favicon.ico", (_req: Request, res: Response) =>
  res.status(204).end()
);

// routes
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/zones", zoneRouter);
router.use("/api/v1/cameras", cameraRouter);

// public camera routes
router.get(
  "/api/v1/public/cameras-ips",
  validateHeaders,
  CameraController.getAllCameraIPs
);
router.patch(
  "/api/v1/public/cameras",
  validateHeaders,
  validate(CameraValidator.bulkUpdateCameraStatusSchema),
  CameraController.bulkUpdateCameraStatus
);

// 404 handler
router.use((_req: Request, res: Response) => {
  throw createHttpError.NotFound("Route not found");
});

// Global error handler
router.use(errorHandler);

export default router;
