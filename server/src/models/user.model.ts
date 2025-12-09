import mongoose, { Schema } from "mongoose";
import { IUserSchema } from "../app/types";
import { hashPassword } from "../utils/password";

const UserSchema: Schema<IUserSchema> = new mongoose.Schema<IUserSchema>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name must be at most 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["user", "admin"],
        message:
          "`{VALUE}` is not a valid role. Allowed values are: user, admin",
      },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
    next();
  } else {
    next();
  }
});

export const UserModel = mongoose.model<IUserSchema>("User", UserSchema);
