import createError from "http-errors";
import { Types } from "mongoose";
import { IZoneSchema } from "../app/types";
import { ZoneModel } from "../models/zone.model";
import { isValidMongoId } from "../utils/validate-mongo-id";

export class ZoneService {
  // Get all zones service
  static async getAllZonesService(query: {
    page?: number;
    limit?: number;
    search?: string;
    includeCameras?: boolean;
  }) {
    const { page = 1, limit = 10, search, includeCameras = false } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: {
      $or?: [
        { name: { $regex: string; $options: string } },
        { description: { $regex: string; $options: string } },
        { location: { $regex: string; $options: string } }
      ];
    } = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    // Build query with optional population
    let zonesQuery = ZoneModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    if (includeCameras) {
      zonesQuery = zonesQuery.populate(
        "cameras",
        "name location status ip mac_id pole latitude longitude history"
      );
    }

    const zones = await zonesQuery.lean();

    // Get total count for pagination
    const totalZones = await ZoneModel.countDocuments(filter);
    const totalPages = Math.ceil(totalZones / Number(limit));

    return {
      data: zones,
      pagination: {
        currentPage: Number(page),
        totalPages,
        items: totalZones,
        limit: Number(limit),
      },
    };
  }

  // Get zone by ID service
  static async getZoneByIdService(id: string, includeCameras: boolean = false) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid zone ID format");
    }

    let zoneQuery = ZoneModel.findById(id);

    if (includeCameras) {
      zoneQuery = zoneQuery.populate(
        "cameras",
        "name location status ip mac_id pole latitude longitude history"
      );
    }

    const zone = await zoneQuery.lean();

    if (!zone) {
      throw createError.NotFound("Zone not found");
    }

    return zone;
  }

  // Create zone service
  static async createZoneService(zoneData: IZoneSchema) {
    const { name, description, location } = zoneData;

    // Check if zone with same name already exists
    const existingZone = await ZoneModel.findOne({ name }).lean();

    if (existingZone) {
      throw createError.Conflict("Zone with this name already exists");
    }

    // Create new zone
    const newZone = new ZoneModel({
      name,
      description,
      location,
      cameras: [],
    });

    await newZone.save();

    return newZone.toObject();
  }

  // Update zone service
  static async updateZoneService(
    id: string,
    updateData: Partial<Pick<IZoneSchema, "name" | "description" | "location">>
  ) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid zone ID format");
    }

    // Check if zone exists
    const existingZone = await ZoneModel.findById(id);
    if (!existingZone) {
      throw createError.NotFound("Zone not found");
    }

    // If name is being updated, check if it's already taken
    if (updateData.name && updateData.name !== existingZone.name) {
      const nameExists = await ZoneModel.findOne({ name: updateData.name });
      if (nameExists) {
        throw createError.Conflict("Zone name is already taken");
      }
    }

    // Update zone
    const updatedZone = await ZoneModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedZone;
  }

  // Delete zone service
  static async deleteZoneService(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid zone ID format");
    }

    const zone = await ZoneModel.findById(id).populate("cameras");
    if (!zone) {
      throw createError.NotFound("Zone not found");
    }

    // Check if zone has cameras assigned
    if (zone.cameras && zone.cameras.length > 0) {
      throw createError.BadRequest(
        "Cannot delete zone that has cameras assigned. Please reassign or remove cameras first."
      );
    }

    await ZoneModel.findByIdAndDelete(id);

    return { message: "Zone deleted successfully" };
  }

  // Add camera to zone service
  static async addCameraToZoneService(zoneId: string, cameraId: string) {
    if (!isValidMongoId(zoneId) || !isValidMongoId(cameraId)) {
      throw createError.BadRequest("Invalid zone or camera ID format");
    }

    const zone = await ZoneModel.findById(zoneId);
    if (!zone) {
      throw createError.NotFound("Zone not found");
    }

    // Check if camera is already in the zone
    const cameraObjectId = new Types.ObjectId(cameraId);
    if (zone.cameras?.includes(cameraObjectId)) {
      throw createError.BadRequest("Camera is already assigned to this zone");
    }

    // Add camera to zone
    await ZoneModel.findByIdAndUpdate(
      zoneId,
      { $addToSet: { cameras: cameraObjectId } },
      { new: true }
    );

    return { message: "Camera added to zone successfully" };
  }

  // Remove camera from zone service
  static async removeCameraFromZoneService(zoneId: string, cameraId: string) {
    if (!isValidMongoId(zoneId) || !isValidMongoId(cameraId)) {
      throw createError.BadRequest("Invalid zone or camera ID format");
    }

    const zone = await ZoneModel.findById(zoneId);
    if (!zone) {
      throw createError.NotFound("Zone not found");
    }

    // Remove camera from zone
    await ZoneModel.findByIdAndUpdate(
      zoneId,
      { $pull: { cameras: new Types.ObjectId(cameraId) } },
      { new: true }
    );

    return { message: "Camera removed from zone successfully" };
  }

  // Get zone statistics service
  static async getZoneStatsService(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid zone ID format");
    }

    const zone = await ZoneModel.findById(id).populate("cameras").lean();
    if (!zone) {
      throw createError.NotFound("Zone not found");
    }

    const cameras = (zone.cameras as any[]) || [];
    const activeCameras = cameras.filter(
      (camera) => camera.status === "active"
    ).length;
    const inactiveCameras = cameras.filter(
      (camera) => camera.status === "inactive"
    ).length;

    return {
      zone: {
        _id: zone._id,
        name: zone.name,
        description: zone.description,
        location: zone.location,
      },
      statistics: {
        totalCameras: cameras.length,
        activeCameras,
        inactiveCameras,
        cameraStatusPercentage: {
          active:
            cameras.length > 0
              ? Math.round((activeCameras / cameras.length) * 100)
              : 0,
          inactive:
            cameras.length > 0
              ? Math.round((inactiveCameras / cameras.length) * 100)
              : 0,
        },
      },
    };
  }
}

export default ZoneService;
