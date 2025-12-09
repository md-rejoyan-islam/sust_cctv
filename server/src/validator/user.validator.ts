import { z } from "zod";

export class UserValidator {
  // Validation for getting all users with query params
  static getAllUsersSchema = z.object({
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
        role: z.enum(["admin", "user"]).optional(),
        search: z
          .string()
          .optional()
          .refine((val) => !val || val.trim().length > 0, {
            message: "Search term cannot be empty",
          }),
      })
      .strict(),
  });

  // Validation for user ID parameter
  static userIdParamSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "User ID is required.";
              }
              return "User ID must be a string.";
            },
          })
          .min(1, { message: "User ID cannot be empty" }),
      })
      .strict(),
  });

  // Validation for creating a user
  static createUserSchema = z.object({
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Name is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Name must be a string.";
              }
              return "Invalid name.";
            },
          })
          .min(2, {
            message: "Name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Name must be at most 100 characters long.",
          })
          .trim(),
        email: z.email({
          error: (iss) => {
            if (!iss.input) {
              return "Email is required.";
            } else if (typeof iss.input !== iss.expected) {
              return "Email must be a string.";
            }
            return "Invalid email format.";
          },
        }),
        password: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Password is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Password must be a string.";
              }
              return "Invalid password.";
            },
          })
          .min(6, {
            message: "Password must be at least 6 characters long.",
          })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
            message:
              "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
          }),
        role: z.enum(["admin", "user"], {
          error: (iss) => {
            if (!iss.input) {
              return "Role is required.";
            } else if (typeof iss.input !== iss.expected) {
              return "Role must be a string.";
            }
            return "Invalid role. Must be either 'admin' or 'user'.";
          },
        }),
      })
      .strict(),
  });

  // Validation for updating a user
  static updateUserSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "User ID is required.";
              }
              return "User ID must be a string.";
            },
          })
          .min(1, { message: "User ID cannot be empty" }),
      })
      .strict(),
    body: z
      .object({
        name: z
          .string({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Name must be a string.";
              }
              return "Invalid name.";
            },
          })
          .min(2, {
            message: "Name must be at least 2 characters long.",
          })
          .max(100, {
            message: "Name must be at most 100 characters long.",
          })
          .trim()
          .optional(),
        email: z
          .string()
          .email({
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Email must be a string.";
              }
              return "Invalid email format.";
            },
          })
          .optional(),
        role: z
          .enum(["admin", "user"], {
            error: (iss) => {
              if (typeof iss.input !== iss.expected) {
                return "Role must be a string.";
              }
              return "Invalid role. Must be either 'admin' or 'user'.";
            },
          })
          .optional(),
      })
      .strict()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  });

  // Validation for changing user password (admin only)
  static changeUserPasswordSchema = z.object({
    params: z
      .object({
        id: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "User ID is required.";
              }
              return "User ID must be a string.";
            },
          })
          .min(1, { message: "User ID cannot be empty" }),
      })
      .strict(),
    body: z
      .object({
        newPassword: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "New password is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "New password must be a string.";
              }
              return "Invalid new password.";
            },
          })
          .min(6, {
            message: "New password must be at least 6 characters long.",
          })
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, {
            message:
              "New password must contain at least one uppercase letter, one lowercase letter, and one number.",
          }),
      })
      .strict(),
  });
}

export default UserValidator;
