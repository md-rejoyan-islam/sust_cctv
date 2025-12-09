import { z } from "zod";

export class CameraValidator {
  // Validation for getting all cameras with query params
  static getAllCamerasSchema = z.object({
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
        status: z.enum(["active", "inactive"]).optional(),
        zone: z
          .string()
          .optional()
          .refine((val) => !val || val.trim().length > 0, {
            message: "Zone ID cannot be empty",
          }),
        includeZone: z
          .string()
          .optional()
          .refine((val) => !val || val === "true" || val === "false", {
            message: "includeZone must be 'true' or 'false'",
          }),
      })
      .strict(),
  });

  // Validation for camera ID parameter
  static cameraIdParamSchema = z.object({
    params: z
      .object({
        id: z
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

  // Validation for creating a camera
  static createCameraSchema = z.object({
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Camera name is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Camera name must be a string.";
              }
              return "Invalid camera name.";
            },
          })
          .min(2, {
            message: "Camera name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Camera name must be at most 100 characters long.",
          })
          .trim(),
        latitude: z
          .number({
            error: (iss) => {
              if (!iss.input && iss.input !== 0) {
                return "Latitude is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Latitude must be a number.";
              }
              return "Invalid latitude.";
            },
          })
          .min(-90, {
            message: "Latitude must be between -90 and 90.",
          })
          .max(90, {
            message: "Latitude must be between -90 and 90.",
          }),
        longitude: z
          .number({
            error: (iss) => {
              if (!iss.input && iss.input !== 0) {
                return "Longitude is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Longitude must be a number.";
              }
              return "Invalid longitude.";
            },
          })
          .min(-180, {
            message: "Longitude must be between -180 and 180.",
          })
          .max(180, {
            message: "Longitude must be between -180 and 180.",
          }),
        zone: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Zone ID is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Zone ID must be a string.";
              }
              return "Invalid zone ID.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" }),
        pole: z
          .number({
            error: (iss) => {
              if (!iss.input && iss.input !== 0) {
                return "Pole number is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Pole number must be a number.";
              }
              return "Invalid pole number.";
            },
          })
          .int({
            message: "Pole number must be an integer.",
          })
          .min(0, {
            message: "Pole number must be positive.",
          }),
        location: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Location must be a string.";
              }
              return "Invalid location.";
            },
          })
          .max(200, {
            message: "Location must be at most 200 characters long.",
          })
          .trim()
          .optional(),
        mac_id: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "MAC ID must be a string.";
              }
              return "Invalid MAC ID.";
            },
          })
          .optional(),
        ip: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "IP address must be a string.";
              }
              return "Invalid IP address.";
            },
          })
          .regex(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            {
              message: "Please enter a valid IP address (e.g., 192.168.1.1)",
            }
          )
          .trim()
          .optional(),
        status: z
          .enum(["active", "inactive"], {
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Status must be a string.";
              }
              return "Invalid status. Must be either 'active' or 'inactive'.";
            },
          })
          .optional(),
        notes: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Notes must be a string.";
              }
              return "Invalid notes.";
            },
          })
          .max(500, {
            message: "Notes must be at most 500 characters long.",
          })
          .trim()
          .optional(),
      })
      .strict(),
  });

  // Validation for updating a camera
  static updateCameraSchema = z.object({
    params: z
      .object({
        id: z
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
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Camera name must be a string.";
              }
              return "Invalid camera name.";
            },
          })
          .min(2, {
            message: "Camera name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Camera name must be at most 100 characters long.",
          })
          .trim()
          .optional(),
        latitude: z
          .number({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Latitude must be a number.";
              }
              return "Invalid latitude.";
            },
          })
          .min(-90, {
            message: "Latitude must be between -90 and 90.",
          })
          .max(90, {
            message: "Latitude must be between -90 and 90.",
          })
          .optional(),
        longitude: z
          .number({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Longitude must be a number.";
              }
              return "Invalid longitude.";
            },
          })
          .min(-180, {
            message: "Longitude must be between -180 and 180.",
          })
          .max(180, {
            message: "Longitude must be between -180 and 180.",
          })
          .optional(),
        zone: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Zone ID must be a string.";
              }
              return "Invalid zone ID.";
            },
          })
          .min(1, { message: "Zone ID cannot be empty" })
          .optional(),
        pole: z
          .number({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Pole number must be a number.";
              }
              return "Invalid pole number.";
            },
          })
          .int({
            message: "Pole number must be an integer.",
          })
          .min(1, {
            message: "Pole number must be positive.",
          })
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
          .max(200, {
            message: "Location must be at most 200 characters long.",
          })
          .trim()
          .optional(),
        mac_id: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "MAC ID must be a string.";
              }
              return "Invalid MAC ID.";
            },
          })
          .optional(),
        ip: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "IP address must be a string.";
              }
              return "Invalid IP address.";
            },
          })
          .regex(
            /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
            {
              message: "Please enter a valid IP address (e.g., 192.168.1.1)",
            }
          )
          .trim()
          .optional(),
        status: z
          .enum(["active", "inactive"], {
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Status must be a string.";
              }
              return "Invalid status. Must be either 'active' or 'inactive'.";
            },
          })
          .optional(),
        notes: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Notes must be a string.";
              }
              return "Invalid notes.";
            },
          })
          .max(500, {
            message: "Notes must be at most 500 characters long.",
          })
          .trim()
          .optional(),
      })
      .strict()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  });

  // Validation for updating camera status
  static updateCameraStatusSchema = z.object({
    params: z
      .object({
        id: z
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
    body: z
      .object({
        status: z.enum(["active", "inactive"], {
          error: (iss) => {
            if (!iss.input) {
              return "Status is required.";
            } else if (typeof iss.input !== iss.expected) {
              return "Status must be a string.";
            }
            return "Invalid status. Must be either 'active' or 'inactive'.";
          },
        }),
      })
      .strict(),
  });

  // Validation for getting camera with zone
  static getCameraWithZoneSchema = z.object({
    params: z
      .object({
        id: z
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
    query: z
      .object({
        includeZone: z
          .string()
          .optional()
          .refine((val) => !val || val === "true" || val === "false", {
            message: "includeZone must be 'true' or 'false'",
          }),
      })
      .strict(),
  });

  // Validation for bulk updating camera status by IP addresses
  static bulkUpdateCameraStatusSchema = z.object({
    body: z
      .array(
        z.object({
          ip: z
            .string({
              error: (iss) => {
                if (!iss.input) {
                  return "IP address is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "IP address must be a string.";
                }
                return "Invalid IP address.";
              },
            })
            .regex(
              /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              {
                message: "Please enter a valid IP address (e.g., 192.168.1.1)",
              }
            )
            .trim(),
          status: z.boolean({
            error: (iss) => {
              if (iss.input === undefined || iss.input === null) {
                return "Status is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Status must be a boolean (true or false).";
              }
              return "Invalid status.";
            },
          }),
        })
      )
      .min(1, {
        message: "At least one camera update is required.",
      })
      .max(100, {
        message: "Maximum 100 cameras can be updated at once.",
      })
      .refine(
        (cameras) => {
          const ips = cameras.map((camera) => camera.ip);
          const uniqueIps = new Set(ips);
          return ips.length === uniqueIps.size;
        },
        {
          message: "Duplicate IP addresses are not allowed.",
        }
      ),
  });

  // Validation for bulk creating cameras
  static bulkCreateCamerasSchema = z.object({
    body: z
      .array(
        z.object({
          name: z
            .string({
              error: (iss) => {
                if (!iss.input) {
                  return "Camera name is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "Camera name must be a string.";
                }
                return "Invalid camera name.";
              },
            })
            .min(2, {
              message: "Camera name must be at least 2 characters long.",
            })
            .max(100, {
              message: "Camera name must be at most 100 characters long.",
            })
            .trim(),
          latitude: z
            .number({
              error: (iss) => {
                if (!iss.input && iss.input !== 0) {
                  return "Latitude is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "Latitude must be a number.";
                }
                return "Invalid latitude.";
              },
            })
            .min(-90, {
              message: "Latitude must be between -90 and 90.",
            })
            .max(90, {
              message: "Latitude must be between -90 and 90.",
            }),
          longitude: z
            .number({
              error: (iss) => {
                if (!iss.input && iss.input !== 0) {
                  return "Longitude is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "Longitude must be a number.";
                }
                return "Invalid longitude.";
              },
            })
            .min(-180, {
              message: "Longitude must be between -180 and 180.",
            })
            .max(180, {
              message: "Longitude must be between -180 and 180.",
            }),
          zone: z
            .string({
              error: (iss) => {
                if (!iss.input) {
                  return "Zone ID is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "Zone ID must be a string.";
                }
                return "Invalid zone ID.";
              },
            })
            .min(1, { message: "Zone ID cannot be empty" }),
          pole: z
            .number({
              error: (iss) => {
                if (!iss.input && iss.input !== 0) {
                  return "Pole number is required.";
                } else if (typeof iss.input !== iss.expected) {
                  return "Pole number must be a number.";
                }
                return "Invalid pole number.";
              },
            })
            .int({
              message: "Pole number must be an integer.",
            })
            .min(0, {
              message: "Pole number must be positive.",
            }),
          location: z
            .string({
              error: (iss) => {
                if (typeof iss.input !== iss.expected) {
                  return "Location must be a string.";
                }
                return "Invalid location.";
              },
            })
            .max(200, {
              message: "Location must be at most 200 characters long.",
            })
            .trim()
            .optional(),
          mac_id: z
            .string({
              error: (iss) => {
                if (typeof iss.input !== iss.expected) {
                  return "MAC ID must be a string.";
                }
                return "Invalid MAC ID.";
              },
            })
            .regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, {
              message:
                "Please enter a valid MAC address (e.g., 00:1B:44:11:3A:B7 or 00-1B-44-11-3A-B7)",
            })
            .trim()
            .optional(),
          ip: z
            .string({
              error: (iss) => {
                if (typeof iss.input !== iss.expected) {
                  return "IP address must be a string.";
                }
                return "Invalid IP address.";
              },
            })
            .regex(
              /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
              {
                message: "Please enter a valid IP address (e.g., 192.168.1.1)",
              }
            )
            .trim()
            .optional(),
          status: z
            .enum(["active", "inactive"], {
              error: (iss) => {
                if (typeof iss.input !== iss.expected) {
                  return "Status must be a string.";
                }
                return "Invalid status. Must be either 'active' or 'inactive'.";
              },
            })
            .optional(),
          notes: z
            .string({
              error: (iss) => {
                if (typeof iss.input !== iss.expected) {
                  return "Notes must be a string.";
                }
                return "Invalid notes.";
              },
            })
            .max(500, {
              message: "Notes must be at most 500 characters long.",
            })
            .trim()
            .optional(),
        })
      )
      .min(1, {
        message: "At least one camera is required.",
      })
      .max(100, {
        message: "Maximum 100 cameras can be created at once.",
      })
      .refine(
        (cameras) => {
          const macIds = cameras.map((camera) => camera.mac_id).filter(Boolean);
          const uniqueMacIds = new Set(macIds);
          return macIds.length === uniqueMacIds.size;
        },
        {
          message: "Duplicate MAC addresses are not allowed.",
        }
      )
      .refine(
        (cameras) => {
          const ips = cameras.map((camera) => camera.ip).filter(Boolean);
          const uniqueIps = new Set(ips);
          return ips.length === uniqueIps.size;
        },
        {
          message: "Duplicate IP addresses are not allowed.",
        }
      )
      .refine(
        (cameras) => {
          const names = cameras.map((camera) => camera.name);
          const uniqueNames = new Set(names);
          return names.length === uniqueNames.size;
        },
        {
          message: "Duplicate camera names are not allowed.",
        }
      ),
  });
}

export default CameraValidator;
