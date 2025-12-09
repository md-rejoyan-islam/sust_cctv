import { NextFunction, Request, Response } from "express";
import { z } from "zod";

// Define schema for validating custom headers
const HeaderSchema = z.object({
  "x-token": z
    .string("x-token header is required")
    .min(10, "x-token must be at least 10 characters long"),

  "x-id": z
    .string("x-id header is required")
    .regex(/^[a-f\d]{24}$/i, "x-id must be a valid 24-character ObjectId"),

  "x-unique-number": z
    .string("x-unique-number header is required")
    .regex(/^\d+$/, "x-unique-number must be a numeric string"),
});

// Middleware for validating headers from user request
export const validateHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Convert all headers to lowercase (for consistency)
  const headers = Object.keys(req.headers).reduce((acc, key) => {
    acc[key.toLowerCase()] = req.headers[key];
    return acc;
  }, {} as Record<string, unknown>);

  const result = HeaderSchema.safeParse(headers);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => issue.message);

    return res.status(400).json({
      success: false,
      message: "Invalid or missing headers",
      errors,
    });
  }

  next();
};
