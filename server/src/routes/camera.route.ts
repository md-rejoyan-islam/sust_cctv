import { Router } from "express";
import { CameraController } from "../controllers/camera.controller";
import { authorize } from "../middlewares/authorized";
import validate from "../middlewares/validate";
import { isLoggedIn } from "../middlewares/verify";
import CameraValidator from "../validator/camera.validator";

const cameraRouter = Router();

// All routes require authentication
cameraRouter.use(isLoggedIn);

/**
 * @route GET /cameras
 * @desc Get all cameras with pagination and filters
 * @query page?: number, limit?: number, search?: string, status?: 'active'|'inactive', zone?: string, includeZone?: boolean
 * @access Private (All authenticated users)
 */
cameraRouter.get(
  "/",
  validate(CameraValidator.getAllCamerasSchema),
  CameraController.getAllCameras
);

/**
 * @route POST /cameras
 * @desc Add/Create a new camera
 * @body { name: string, latitude: number, longitude: number, zone: string, pole: number, location?: string, mac_id: string, ip?: string, status?: 'active'|'inactive' }
 * @access Private (Admin only)
 */
cameraRouter.post(
  "/",
  authorize(["admin"]),
  validate(CameraValidator.createCameraSchema),
  CameraController.addCamera
);

/**
 * @route POST /cameras/bulk
 * @desc Bulk create cameras
 * @body [{ name: string, latitude: number, longitude: number, zone: string, pole: number, location?: string, mac_id: string, ip?: string, status?: 'active'|'inactive' }]
 * @access Private (Admin only)
 */
cameraRouter.post(
  "/bulk",
  authorize(["admin"]),
  validate(CameraValidator.bulkCreateCamerasSchema),
  CameraController.bulkCreateCameras
);

/**
 * @route GET /cameras/stats
 * @desc Get camera statistics (overview and zone distribution)
 * @access Private (All authenticated users)
 */
cameraRouter.get("/stats", CameraController.getCameraStats);

/**
 * @route GET /cameras/:id
 * @desc Get camera by ID
 * @params id: string
 * @query includeZone?: boolean
 * @access Private (All authenticated users)
 */
cameraRouter.get(
  "/:id",
  validate(CameraValidator.getCameraWithZoneSchema),
  CameraController.getCameraById
);

/**
 * @route PUT /cameras/:id
 * @desc Update camera
 * @params id: string
 * @body { name?: string, latitude?: number, longitude?: number, zone?: string, pole?: number, location?: string, mac_id?: string, ip?: string, status?: 'active'|'inactive' }
 * @access Private (Admin only)
 */
cameraRouter.put(
  "/:id",
  authorize(["admin"]),
  validate(CameraValidator.updateCameraSchema),
  CameraController.updateCamera
);

/**
 * @route DELETE /cameras/:id
 * @desc Delete camera
 * @params id: string
 * @access Private (Admin only)
 */
cameraRouter.delete(
  "/:id",
  authorize(["admin"]),
  validate(CameraValidator.cameraIdParamSchema),
  CameraController.deleteCamera
);

/**
 * @route PATCH /cameras/:id/status
 * @desc Update camera status
 * @params id: string
 * @body { status: 'active'|'inactive' }
 * @access Private (Admin only)
 */

cameraRouter.patch(
  "/:id/status",
  authorize(["admin"]),
  validate(CameraValidator.updateCameraStatusSchema),
  CameraController.updateCameraStatus
);

export default cameraRouter;
