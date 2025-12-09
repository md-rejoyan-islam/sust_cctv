import createError from "http-errors";
import { Types } from "mongoose";
import { ICameraSchema } from "../app/types";
import { CameraModel } from "../models/camera.model";
import { ZoneModel } from "../models/zone.model";
import { isValidMongoId } from "../utils/validate-mongo-id";

export class CameraService {
  // Get all cameras service
  static async getAllCameras(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    zone?: string;
    includeZone?: boolean;
  }) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      zone,
      includeZone = false,
    } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: {
      status?: string;
      zone?: Types.ObjectId;
      $or?: {
        name?: { $regex: string; $options: string };
        location?: { $regex: string; $options: string };
        mac_id?: { $regex: string; $options: string };
        ip?: { $regex: string; $options: string };
        notes?: { $regex: string; $options: string };
      }[];
    } = {};

    if (status && (status === "active" || status === "inactive")) {
      filter.status = status;
    }

    if (zone && isValidMongoId(zone)) {
      filter.zone = new Types.ObjectId(zone);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { mac_id: { $regex: search, $options: "i" } },
        { ip: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
      ];
    }

    // Build query with optional population
    let camerasQuery = CameraModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    // include zone details if requested
    if (includeZone) {
      camerasQuery = camerasQuery.populate("zone", "name description location");
    }

    const cameras = await camerasQuery.lean();

    // Get total count for pagination
    const totalCameras = await CameraModel.countDocuments(filter);
    const totalPages = Math.ceil(totalCameras / Number(limit));

    return {
      data: cameras,
      pagination: {
        currentPage: Number(page),
        totalPages,
        items: totalCameras,
        limit: Number(limit),
      },
    };
  }

  // Get camera by ID service
  static async getCameraById(id: string, includeZone: boolean = false) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid camera ID format");
    }

    let cameraQuery = CameraModel.findById(id);

    if (includeZone) {
      cameraQuery = cameraQuery.populate("zone", "name description location");
    }

    const camera = await cameraQuery.lean();

    if (!camera) {
      throw createError.NotFound("Camera not found");
    }

    return camera;
  }

  // Create camera service
  static async createCamera(cameraData: ICameraSchema) {
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
    } = cameraData;

    // Validate zone exists
    if (!isValidMongoId(zone.toString())) {
      throw createError.BadRequest("Invalid zone ID format");
    }

    const zoneExists = await ZoneModel.findById(zone);
    if (!zoneExists) {
      throw createError.BadRequest("Zone not found");
    }

    // Check if MAC ID is already taken
    if (mac_id) {
      const existingMacId = await CameraModel.findOne({ mac_id }).lean();
      if (existingMacId) {
        throw createError.Conflict("Camera with this MAC ID already exists");
      }
    }

    // Check if IP is already taken (if provided)
    if (ip) {
      const existingIp = await CameraModel.findOne({ ip }).lean();
      if (existingIp) {
        throw createError.Conflict(
          "Camera with this IP address already exists"
        );
      }
    }

    // Check if pole number is already taken in the same zone
    const existingPole = await CameraModel.findOne({ zone, pole }).lean();
    if (existingPole) {
      throw createError.Conflict(
        "Camera with this pole number already exists in the zone"
      );
    }

    // Create new camera (initialize history with initial status)
    const initialStatus = status || "active";
    const newCamera = new CameraModel({
      name,
      latitude,
      longitude,
      zone,
      pole,
      location,
      mac_id,
      ip,
      status: initialStatus,
      notes,
      history: [
        {
          date: new Date(),
          status: initialStatus,
        },
      ],
    });

    await newCamera.save();

    // Add camera to zone's cameras array
    await ZoneModel.findByIdAndUpdate(zone, {
      $addToSet: { cameras: newCamera._id },
    });

    return newCamera.toObject();
  }

  // Update camera service
  static async updateCamera(id: string, updateData: Partial<ICameraSchema>) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid camera ID format");
    }

    // Check if camera exists
    const existingCamera = await CameraModel.findById(id);
    if (!existingCamera) {
      throw createError.NotFound("Camera not found");
    }

    // Validate zone if being updated
    if (updateData.zone) {
      if (!isValidMongoId(updateData.zone.toString())) {
        throw createError.BadRequest("Invalid zone ID format");
      }

      const zoneExists = await ZoneModel.findById(updateData.zone);
      if (!zoneExists) {
        throw createError.BadRequest("Zone not found");
      }
    }

    // Check if MAC ID is already taken by another camera
    if (updateData.mac_id && updateData.mac_id !== existingCamera.mac_id) {
      const macIdExists = await CameraModel.findOne({
        mac_id: updateData.mac_id,
        _id: { $ne: id },
      });
      if (macIdExists) {
        throw createError.Conflict("MAC ID is already taken");
      }
    }

    // Check if IP is already taken by another camera
    if (updateData.ip && updateData.ip !== existingCamera.ip) {
      const ipExists = await CameraModel.findOne({
        ip: updateData.ip,
        _id: { $ne: id },
      });
      if (ipExists) {
        throw createError.Conflict("IP address is already taken");
      }
    }

    // Check if pole number is already taken in the zone by another camera
    if (updateData.pole && updateData.pole !== existingCamera.pole) {
      const zoneToCheck = updateData.zone || existingCamera.zone;
      const poleExists = await CameraModel.findOne({
        zone: zoneToCheck,
        pole: updateData.pole,
        _id: { $ne: id },
      });
      if (poleExists) {
        throw createError.Conflict("Pole number is already taken in this zone");
      }
    }

    // If zone is being changed, update the zone references
    if (
      updateData.zone &&
      updateData.zone.toString() !== existingCamera.zone.toString()
    ) {
      // Remove camera from old zone
      await ZoneModel.findByIdAndUpdate(existingCamera.zone, {
        $pull: { cameras: id },
      });

      // Add camera to new zone
      await ZoneModel.findByIdAndUpdate(updateData.zone, {
        $addToSet: { cameras: id },
      });
    }

    // Update camera
    const updatedCamera = await CameraModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedCamera;
  }

  // Delete camera service
  static async deleteCamera(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid camera ID format");
    }

    const camera = await CameraModel.findById(id);
    if (!camera) {
      throw createError.NotFound("Camera not found");
    }

    // Remove camera from zone's cameras array
    await ZoneModel.findByIdAndUpdate(camera.zone, { $pull: { cameras: id } });

    // Delete camera
    await CameraModel.findByIdAndDelete(id);

    return { message: "Camera deleted successfully" };
  }

  // Update camera status service
  static async updateCameraStatus(id: string, status: "active" | "inactive") {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid camera ID format");
    }

    const camera = await CameraModel.findById(id);
    if (!camera) {
      throw createError.NotFound("Camera not found");
    }

    // If status changed, push to history and trim to last 30
    const updateObj: any = { $set: { status } };
    if (camera.status !== status) {
      updateObj.$push = {
        history: {
          $each: [{ date: new Date(), status }],
          $slice: -30,
        },
      };
    }

    const updatedCamera = await CameraModel.findByIdAndUpdate(id, updateObj, {
      new: true,
      runValidators: true,
    }).lean();

    return updatedCamera;
  }

  // Get all camera IPs service
  static async getAllCameraIPs() {
    // Find all cameras and select only the IP field
    const cameras = await CameraModel.find(
      { ip: { $exists: true, $ne: null } },
      { ip: 1, _id: 0 }
    ).lean();

    const ips = cameras
      .map((camera) => camera.ip)
      .filter((ip) => ip)
      .sort();

    return ips;
  }

  // Get camera statistics service
  static async getCameraStats() {
    const totalCameras = await CameraModel.countDocuments();
    const activeCameras = await CameraModel.countDocuments({
      status: "active",
    });
    const inactiveCameras = await CameraModel.countDocuments({
      status: "inactive",
    });

    // Get zone distribution
    const zoneDistribution = await CameraModel.aggregate([
      {
        $group: {
          _id: "$zone",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "zones",
          localField: "_id",
          foreignField: "_id",
          as: "zoneInfo",
        },
      },
      {
        $unwind: "$zoneInfo",
      },
      {
        $project: {
          zoneName: "$zoneInfo.name",
          cameraCount: "$count",
        },
      },
      {
        $sort: { cameraCount: -1 },
      },
    ]);

    return {
      overview: {
        totalCameras,
        activeCameras,
        inactiveCameras,
        statusPercentage: {
          active:
            totalCameras > 0
              ? Math.round((activeCameras / totalCameras) * 100)
              : 0,
          inactive:
            totalCameras > 0
              ? Math.round((inactiveCameras / totalCameras) * 100)
              : 0,
        },
      },
      zoneDistribution,
    };
  }

  // Bulk update camera status by IP addresses service
  static async bulkUpdateCameraStatus(
    cameraUpdates: { ip: string; status: boolean }[]
  ) {
    const results = {
      updated: [] as any[],
      notFound: [] as string[],
      errors: [] as { ip: string; error: string }[],
    };

    // Extract all IP addresses from the request
    const ipAddresses = cameraUpdates.map((update) => update.ip);

    // Find all cameras with the provided IP addresses
    const existingCameras = await CameraModel.find({
      ip: { $in: ipAddresses },
    }).lean();

    // Create a map for quick lookup
    const cameraMap = new Map();
    existingCameras.forEach((camera) => {
      if (camera.ip) {
        cameraMap.set(camera.ip, camera);
      }
    });

    // Process each update request
    for (const updateRequest of cameraUpdates) {
      const { ip, status } = updateRequest;

      try {
        const camera = cameraMap.get(ip);

        if (!camera) {
          results.notFound.push(ip);
          continue;
        }

        // Convert boolean status to string for database
        const statusString = status ? "active" : "inactive";

        // Update the camera status and push history if changed
        const updateObj: any = { $set: { status: statusString } };
        if (camera.status !== statusString) {
          updateObj.$push = {
            history: {
              $each: [{ date: new Date(), status: statusString }],
              $slice: -30,
            },
          };
        }

        const updatedCamera = await CameraModel.findByIdAndUpdate(
          camera._id,
          updateObj,
          { new: true, runValidators: true }
        ).lean();

        if (updatedCamera) {
          results.updated.push({
            id: updatedCamera._id,
            name: updatedCamera.name,
            ip: updatedCamera.ip,
            previousStatus: camera.status,
            newStatus: updatedCamera.status,
          });
        }
      } catch (error) {
        results.errors.push({
          ip,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }

    return {
      success: results.updated.length > 0,
      summary: {
        totalRequested: cameraUpdates.length,
        updated: results.updated.length,
        notFound: results.notFound.length,
        errors: results.errors.length,
      },
      details: results,
    };
  }

  // Bulk create cameras service
  static async bulkCreateCameras(camerasData: ICameraSchema[]) {
    const results = {
      created: [] as any[],
      errors: [] as { index: number; name: string; error: string }[],
      validationErrors: [] as {
        index: number;
        name: string;
        field: string;
        error: string;
      }[],
    };

    // Get all unique zone IDs from the request
    const zoneIds = [
      ...new Set(camerasData.map((camera) => camera.zone.toString())),
    ];

    // Validate all zones exist
    const existingZones = await ZoneModel.find({
      _id: { $in: zoneIds.filter((id) => isValidMongoId(id)) },
    }).lean();

    const existingZoneIds = new Set(
      existingZones.map((zone) => zone._id.toString())
    );

    // Get existing MAC IDs and IPs to check for duplicates
    const existingMacIds = new Set();
    const existingIps = new Set();
    const existingCameras = await CameraModel.find(
      {},
      { mac_id: 1, ip: 1 }
    ).lean();

    existingCameras.forEach((camera) => {
      if (camera.mac_id) existingMacIds.add(camera.mac_id);
      if (camera.ip) existingIps.add(camera.ip);
    });

    // Get existing pole numbers per zone

    // Process each camera
    for (let index = 0; index < camerasData.length; index++) {
      const cameraData = camerasData[index];

      try {
        // Validate zone exists
        if (!isValidMongoId(cameraData.zone.toString())) {
          results.validationErrors.push({
            index,
            name: cameraData.name,
            field: "zone",
            error: "Invalid zone ID format",
          });
          continue;
        }

        if (!existingZoneIds.has(cameraData.zone.toString())) {
          results.validationErrors.push({
            index,
            name: cameraData.name,
            field: "zone",
            error: "Zone not found",
          });
          continue;
        }

        // Check for duplicate MAC ID
        if (cameraData.mac_id && existingMacIds.has(cameraData.mac_id)) {
          results.validationErrors.push({
            index,
            name: cameraData.name,
            field: "mac_id",
            error: "MAC ID already exists",
          });
          continue;
        }

        // Check for duplicate IP (if provided)
        if (cameraData.ip && existingIps.has(cameraData.ip)) {
          results.validationErrors.push({
            index,
            name: cameraData.name,
            field: "ip",
            error: "IP address already exists",
          });
          continue;
        }

        // Create new camera
        const newCamera = new CameraModel({
          name: cameraData.name,
          latitude: cameraData.latitude,
          longitude: cameraData.longitude,
          zone: cameraData.zone,
          pole: cameraData.pole,
          location: cameraData.location,
          mac_id: cameraData.mac_id,
          ip: cameraData.ip,
          status: cameraData.status || "active",
          notes: cameraData.notes,
        });

        await newCamera.save();

        // Add camera to zone's cameras array
        await ZoneModel.findByIdAndUpdate(cameraData.zone, {
          $addToSet: { cameras: newCamera._id },
        });

        // Add to existing sets to prevent duplicates in the same batch
        existingMacIds.add(cameraData.mac_id);
        if (cameraData.ip) existingIps.add(cameraData.ip);

        results.created.push({
          id: newCamera._id,
          name: newCamera.name,
          mac_id: newCamera.mac_id,
          ip: newCamera.ip,
          zone: newCamera.zone,
          pole: newCamera.pole,
          status: newCamera.status,
        });
      } catch (error) {
        results.errors.push({
          index,
          name: cameraData.name,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }

    return {
      success: results.created.length > 0,
      summary: {
        totalRequested: camerasData.length,
        created: results.created.length,
        validationErrors: results.validationErrors.length,
        errors: results.errors.length,
      },
      details: {
        created: results.created,
        validationErrors: results.validationErrors,
        errors: results.errors,
      },
    };
  }
}

export default CameraService;
