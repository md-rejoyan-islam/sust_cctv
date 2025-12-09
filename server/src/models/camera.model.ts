import mongoose, { Schema } from "mongoose";
import { ICameraSchema } from "../app/types";

const CameraSchema: Schema<ICameraSchema> = new Schema<ICameraSchema>(
  {
    name: {
      type: String,
      required: [true, "Camera name is required"],
      trim: true,
      minlength: [2, "Camera name must be at least 2 characters long"],
      maxlength: [100, "Camera name must be at most 100 characters long"],
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: [-90, "Latitude must be between -90 and 90"],
      max: [90, "Latitude must be between -90 and 90"],
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: [-180, "Longitude must be between -180 and 180"],
      max: [180, "Longitude must be between -180 and 180"],
    },
    pole: {
      type: Number,
      required: [true, "Pole number is required"],
      min: [0, "Pole number must be positive"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, "Location must be at most 200 characters long"],
    },
    mac_id: {
      type: String,
      trim: true,
      match: [
        /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
        "Please enter a valid MAC address",
      ],
      default: null,
    },
    ip: {
      type: String,
      trim: true,
      match: [
        /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        "Please enter a valid IP address",
      ],
    },
    zone: {
      type: Schema.Types.ObjectId,
      ref: "Zone",
      required: [true, "Zone is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive"],
        message:
          "`{VALUE}` is not a valid status. Allowed values are: active, inactive",
      },
      default: "active",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes must be at most 500 characters long"],
    },
    history: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: {
            values: ["active", "inactive"],
            message:
              "`{VALUE}` is not a valid status. Allowed values are: active, inactive",
          },
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const CameraModel = mongoose.model("Camera", CameraSchema);
