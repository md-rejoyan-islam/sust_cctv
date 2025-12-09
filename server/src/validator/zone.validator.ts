import { z } from "zod";

export class ZoneValidator {
  // Validation for getting all zones with query params
  static getAllZonesSchema = z.object({
    query: z
      .object({
        page: z
          .string()
          .optional()
          .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
            message: "Page must be a positive number",
          }),
        limit: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val ||
              (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100),
            {
              message: "Limit must be a positive number between 1 and 100",
            }
          ),
        search: z
          .string()
          .optional()
          .refine((val) => !val || val.trim().length > 0, {
            message: "Search term cannot be empty",
          }),
        includeCameras: z
          .string()
          .optional()
          .refine((val) => !val || val === "true" || val === "false", {
            message: "includeCameras must be 'true' or 'false'",
          }),
      })
      .strict(),
  });

  // Validation for zone ID parameter
  static zoneIdParamSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone ID is required.";
              }
              return "Zone ID must be a string.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" }),
      })
      .strict(),
  });

  // Validation for creating a zone
  static createZoneSchema = z.object({
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone name is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Zone name must be a string.";
              }
              return "Invalid zone name.";
            },
          })
          .min(2, {
            message: "Zone name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Zone name must be at most 100 characters long.",
          })
          .trim(),
        description: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Description must be a string.";
              }
              return "Invalid description.";
            },
          })
          .max(500, {
            message: "Description must be at most 500 characters long.",
          })
          .trim()
          .optional(),
        location: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Location must be a string.";
              }
              return "Invalid location.";
            },
          })
          .trim()
          .optional(),
      })
      .strict(),
  });

  // Validation for updating a zone
  static updateZoneSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone ID is required.";
              }
              return "Zone ID must be a string.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" }),
      })
      .strict(),
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Zone name must be a string.";
              }
              return "Invalid zone name.";
            },
          })
          .min(2, {
            message: "Zone name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Zone name must be at most 100 characters long.",
          })
          .trim()
          .optional(),
        description: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Description must be a string.";
              }
              return "Invalid description.";
            },
          })
          .max(500, {
            message: "Description must be at most 500 characters long.",
          })
          .trim()
          .optional(),
        location: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Location must be a string.";
              }
              return "Invalid location.";
            },
          })
          .trim()
          .optional(),
      })
      .strict()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  });

  // Validation for zone with camera operations
  static zoneCameraSchema = z.object({
    params: z
      .object({
        zoneId: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone ID is required.";
              }
              return "Zone ID must be a string.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" }),
        cameraId: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Camera ID is required.";
              }
              return "Camera ID must be a string.";
            },
          })
          .min(1, { message: "Camera ID cannot be empty" }),
      })
      .strict(),
  });

  // Validation for getting zone with cameras
  static getZoneWithCamerasSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone ID is required.";
              }
              return "Zone ID must be a string.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" }),
      })
      .strict(),
    query: z
      .object({
        includeCameras: z
          .string()
          .optional()
          .refine((val) => !val || val === "true" || val === "false", {
            message: "includeCameras must be 'true' or 'false'",
          }),
      })
      .strict(),
  });
}

export default ZoneValidator;
