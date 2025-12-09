import { Request, Response } from "express";
import { CameraService } from "../services/camera.services";
import { asyncHandler } from "../utils/async-handler";
import { successResponse } from "../utils/response-handler";

export class CameraController {
  // Get all cameras controller
  static getAllCameras = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page, limit, search, status, zone, includeZone } = req.query;

      const result = await CameraService.getAllCameras({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        status: status as string,
        zone: zone as string,
        includeZone: includeZone === "true",
      });

      successResponse(res, {
        statusCode: 200,
        message: "Cameras fetched successfully",
        payload: { ...result },
      });
    }
  );

  // Get camera by ID controller
  static getCameraById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { includeZone } = req.query;

      const camera = await CameraService.getCameraById(
        id,
        includeZone === "true"
      );

      successResponse(res, {
        statusCode: 200,
        message: "Camera fetched successfully",
        payload: { data: camera },
      });
    }
  );

  // Add/Create camera controller
  static addCamera = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const {
        name,
        latitude,
        longitude,
        zone,
        pole,
        location,
        mac_id,
        ip,
        status,
        notes,
      } = req.body;

      const newCamera = await CameraService.createCamera({
        name,
        latitude,
        longitude,
        zone,
        pole,
        location,
        mac_id,
        ip,
        status,
        notes,
      });

      successResponse(res, {
        statusCode: 201,
        message: "Camera added successfully",
        payload: { data: newCamera },
      });
    }
  );

  // Update camera controller
  static updateCamera = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData = req.body;

      const updatedCamera = await CameraService.updateCamera(id, updateData);

      successResponse(res, {
        statusCode: 200,
        message: "Camera updated successfully",
        payload: { data: updatedCamera },
      });
    }
  );

  // Delete camera controller
  static deleteCamera = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const result = await CameraService.deleteCamera(id);

      successResponse(res, {
        statusCode: 200,
        message: result.message,
      });
    }
  );

  // Update camera status controller
  static updateCameraStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { status } = req.body;

      const updatedCamera = await CameraService.updateCameraStatus(id, status);

      successResponse(res, {
        statusCode: 200,
        message: "Camera status updated successfully",
        payload: { data: updatedCamera },
      });
    }
  );

  // Get all camera IPs controller
  static getAllCameraIPs = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const ips = await CameraService.getAllCameraIPs();

      successResponse(res, {
        statusCode: 200,
        message: "Camera IPs fetched successfully",
        payload: {
          data: ips,
        },
      });
    }
  );

  // Get camera statistics controller
  static getCameraStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const stats = await CameraService.getCameraStats();

      successResponse(res, {
        statusCode: 200,
        message: "Camera statistics fetched successfully",
        payload: { data: stats },
      });
    }
  );

  // Bulk update camera status controller
  static bulkUpdateCameraStatus = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const cameraUpdates = req.body;

      const result = await CameraService.bulkUpdateCameraStatus(cameraUpdates);

      // Determine appropriate status code and message
      // 207 Multi-Status for partial success
      const statusCode = result.success ? 200 : 207;
      const message = result.success
        ? result.summary.errors > 0 || result.summary.notFound > 0
          ? "Camera status updated with some issues"
          : "Camera status updated successfully"
        : "Camera status update failed";

      successResponse(res, {
        statusCode,
        message,
        payload: { data: result },
      });
    }
  );

  // Bulk create cameras controller
  static bulkCreateCameras = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const camerasData = req.body;

      console.log("cameras data", camerasData);

      const result = await CameraService.bulkCreateCameras(camerasData);

      // Determine appropriate status code and message
      // 207 Multi-Status for partial success, 201 for complete success, 400 for failure
      const statusCode = result.success
        ? result.summary.validationErrors > 0 || result.summary.errors > 0
          ? 207
          : 201
        : 400;

      const message = result.success
        ? result.summary.validationErrors > 0 || result.summary.errors > 0
          ? "Cameras created with some issues"
          : "Cameras created successfully"
        : "Camera creation failed";

      successResponse(res, {
        statusCode,
        message,
        payload: { data: result },
      });
    }
  );
}

export default CameraController;
