import { Router } from "express";
import { ZoneController } from "../controllers/zone.controller";
import { authorize } from "../middlewares/authorized";
import validate from "../middlewares/validate";
import { isLoggedIn } from "../middlewares/verify";
import { ZoneValidator } from "../validator/zone.validator";

const zoneRouter = Router();

// All routes require authentication
zoneRouter.use(isLoggedIn);

/**
 * @route GET /zones
 * @desc Get all zones with pagination and filters
 * @query page?: number, limit?: number, search?: string, includeCameras?: boolean
 * @access Private (All authenticated users)
 */
zoneRouter.get(
  "/",
  validate(ZoneValidator.getAllZonesSchema),
  ZoneController.getAllZones
);

/**
 * @route POST /zones
 * @desc Create a new zone
 * @body { name: string, description?: string, location?: string }
 * @access Private (Admin only)
 */
zoneRouter.post(
  "/",
  authorize(["admin"]),
  validate(ZoneValidator.createZoneSchema),
  ZoneController.createZone
);

/**
 * @route GET /zones/:id
 * @desc Get zone by ID
 * @params id: string
 * @query includeCameras?: boolean
 * @access Private (All authenticated users)
 */
zoneRouter.get(
  "/:id",
  validate(ZoneValidator.getZoneWithCamerasSchema),
  ZoneController.getZoneById
);

/**
 * @route PUT /zones/:id
 * @desc Update zone
 * @params id: string
 * @body { name?: string, description?: string, location?: string }
 * @access Private (Admin only)
 */
zoneRouter.put(
  "/:id",
  authorize(["admin"]),
  validate(ZoneValidator.updateZoneSchema),
  ZoneController.updateZone
);

/**
 * @route DELETE /zones/:id
 * @desc Delete zone (only if no cameras assigned)
 * @params id: string
 * @access Private (Admin only)
 */
zoneRouter.delete(
  "/:id",
  authorize(["admin"]),
  validate(ZoneValidator.zoneIdParamSchema),
  ZoneController.deleteZone
);

/**
 * @route GET /zones/:id/stats
 * @desc Get zone statistics (camera counts, status distribution)
 * @params id: string
 * @access Private (All authenticated users)
 */
zoneRouter.get(
  "/:id/stats",
  validate(ZoneValidator.zoneIdParamSchema),
  ZoneController.getZoneStats
);

/**
 * @route POST /zones/:zoneId/cameras/:cameraId
 * @desc Add camera to zone
 * @params zoneId: string, cameraId: string
 * @access Private (Admin only)
 */
zoneRouter.post(
  "/:zoneId/cameras/:cameraId",
  authorize(["admin"]),
  validate(ZoneValidator.zoneCameraSchema),
  ZoneController.addCameraToZone
);

/**
 * @route DELETE /zones/:zoneId/cameras/:cameraId
 * @desc Remove camera from zone
 * @params zoneId: string, cameraId: string
 * @access Private (Admin only)
 */
zoneRouter.delete(
  "/:zoneId/cameras/:cameraId",
  authorize(["admin"]),
  validate(ZoneValidator.zoneCameraSchema),
  ZoneController.removeCameraFromZone
);

export default zoneRouter;
