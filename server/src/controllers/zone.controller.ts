import { Request, Response } from "express";
import { ZoneService } from "../services/zone.services";
import { asyncHandler } from "../utils/async-handler";
import { successResponse } from "../utils/response-handler";

export class ZoneController {
  // Get all zones controller
  static getAllZones = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page, limit, search, includeCameras } = req.query;

      const result = await ZoneService.getAllZonesService({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
        includeCameras: includeCameras === "true",
      });

      successResponse(res, {
        statusCode: 200,
        message: "Zones fetched successfully",
        payload: result,
      });
    }
  );

  // Get zone by ID controller
  static getZoneById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const { includeCameras } = req.query;

      const zone = await ZoneService.getZoneByIdService(
        id,
        includeCameras === "true"
      );

      successResponse(res, {
        statusCode: 200,
        message: "Zone fetched successfully",
        payload: { data: zone },
      });
    }
  );

  // Create zone controller
  static createZone = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, description, location } = req.body;

      const newZone = await ZoneService.createZoneService({
        name,
        description,
        location,
      });

      successResponse(res, {
        statusCode: 201,
        message: "Zone created successfully",
        payload: { data: newZone },
      });
    }
  );

  // Update zone controller
  static updateZone = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData = req.body;

      const updatedZone = await ZoneService.updateZoneService(id, updateData);

      successResponse(res, {
        statusCode: 200,
        message: "Zone updated successfully",
        payload: { data: updatedZone },
      });
    }
  );

  // Delete zone controller
  static deleteZone = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const result = await ZoneService.deleteZoneService(id);

      successResponse(res, {
        statusCode: 200,
        message: result.message,
      });
    }
  );

  // Add camera to zone controller
  static addCameraToZone = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { zoneId, cameraId } = req.params;

      const result = await ZoneService.addCameraToZoneService(zoneId, cameraId);

      successResponse(res, {
        statusCode: 200,
        message: result.message,
      });
    }
  );

  // Remove camera from zone controller
  static removeCameraFromZone = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { zoneId, cameraId } = req.params;

      const result = await ZoneService.removeCameraFromZoneService(
        zoneId,
        cameraId
      );

      successResponse(res, {
        statusCode: 200,
        message: result.message,
      });
    }
  );

  // Get zone statistics controller
  static getZoneStats = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const stats = await ZoneService.getZoneStatsService(id);

      successResponse(res, {
        statusCode: 200,
        message: "Zone statistics fetched successfully",
        payload: { data: stats },
      });
    }
  );
}

export default ZoneController;
