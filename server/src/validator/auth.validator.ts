import { z } from "zod";

export class AuthValidator {
  static loginSchema = z.object({
    body: z
      .object({
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
          }),
      })
      .strict(),
  });

  static changePasswordSchema = z.object({
    body: z
      .object({
        currentPassword: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Current password is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Current password must be a string.";
              }
              return "Invalid current password.";
            },
          })
          .min(6, {
            message: "Current password must be at least 6 characters long.",
          }),
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
              return "Invalid Name.";
            },
          })
          .min(2, {
            message: "Name must be at least 2 characters long.",
          }),
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
              "Password must contain at least one uppercase letter, one lowercase letter, and one digit.",
          }),
        role: z.enum(["admin", "user"], {
          error: (iss) => {
            if (!iss.input) {
              return "Role is required.";
            } else if (typeof iss.input !== iss.expected) {
              return "Role must be a string.";
            }
            return "Invalid role.";
          },
        }),
      })
      .strict(),
  });

  static updateProfileSchema = z.object({
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
          .max(50, {
            message: "Name must be at most 50 characters long.",
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
      })
      .strict()
      .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
      }),
  });

  static refreshTokenSchema = z.object({
    body: z
      .object({
        refreshToken: z
          .string({
            error: (iss) => {
              if (!iss.input) {
                return "Refresh token is required.";
              } else if (typeof iss.input !== iss.expected) {
                return "Refresh token must be a string.";
              }
              return "Invalid refresh token.";
            },
          })
          .min(1, {
            message: "Refresh token cannot be empty.",
          }),
      })
      .strict(),
  });
}

export default AuthValidator;
