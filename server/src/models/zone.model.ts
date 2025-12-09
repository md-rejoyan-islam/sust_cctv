import mongoose, { Schema, Types } from "mongoose";
import { IZoneSchema } from "../app/types";

const ZoneSchema: Schema<IZoneSchema> = new Schema<IZoneSchema>(
  {
    name: {
      type: String,
      required: [true, "Zone name is required"],
      trim: true,
      minlength: [2, "Zone name must be at least 2 characters long"],
      maxlength: [100, "Zone name must be at most 100 characters long"],
      unique: [true, "Zone name must be unique"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description must be at most 500 characters long"],
    },
    location: {
      type: String,
      trim: true,
    },
    cameras: [
      {
        type: Types.ObjectId,
        ref: "Camera",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ZoneModel = mongoose.model("Zone", ZoneSchema);
