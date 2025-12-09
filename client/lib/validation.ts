import { z } from "zod";

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Camera Validation
export const cameraSchema = z.object({
  name: z.string().min(1, "Camera name is required"),
  location: z.string().min(1, "Location is required"),
  zone: z.string().min(1, "Zone is required"),
  latitude: z.number().min(-90).max(90, "Invalid latitude").optional(),
  longitude: z.number().min(-180).max(180, "Invalid longitude").optional(),
  pole: z
    .number({
      invalid_type_error: "Pole number must be a number",
    })
    .min(1, "Pole number must be positive"),
  mac_id: z.string().optional(),
  ip: z.string().ip("Invalid IP address"),
  status: z.enum(["active", "inactive"]),
});

export type CameraFormData = z.infer<typeof cameraSchema>;

// Zone Validation
export const zoneSchema = z.object({
  name: z.string().min(1, "Zone name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type ZoneFormData = z.infer<typeof zoneSchema>;

// User Validation
export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]),
});

export type UserFormData = z.infer<typeof userSchema>;

// Separate schemas for create vs update flows. When updating a user we don't require
// the password field (the backend typically allows leaving it unchanged).
export const userCreateSchema = userSchema;
export const userUpdateSchema = userSchema.omit({ password: true });

export type UserCreateFormData = z.infer<typeof userCreateSchema>;
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>;

// Password Change Validation
export const passwordChangeSchema = z
  .object({
    oldPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const AdminPasswordChangeSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
    id: z.string().min(1, "User ID is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
export type AdminPasswordChangeFormData = z.infer<
  typeof AdminPasswordChangeSchema
>;
