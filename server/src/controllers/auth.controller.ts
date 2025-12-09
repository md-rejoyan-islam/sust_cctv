import { Request, Response } from "express";
import { IRequestWithUser } from "../app/types";
import { AuthService } from "../services/auth.services";
import { asyncHandler } from "../utils/async-handler";
import { successResponse } from "../utils/response-handler";

export class AuthController {
  // Login controller
  static authLogin = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { email, password } = req.body;

      const result = await AuthService.loginService(email, password);

      successResponse(res, {
        statusCode: 200,
        message: "Login successful",
        payload: {
          data: result,
        },
      });
    }
  );

  // Get current user (me) controller
  static getMe = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const userId = req.user?._id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const user = await AuthService.getCurrentUserService(userId);

      successResponse(res, {
        statusCode: 200,
        message: "User profile retrieved successfully",
        payload: { data: user },
      });
    }
  );

  // Change password controller
  static changePassword = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const userId = req.user?._id;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      await AuthService.changePasswordService(
        userId,
        currentPassword,
        newPassword
      );

      successResponse(res, {
        statusCode: 200,
        message: "Password changed successfully",
      });
    }
  );

  // Update profile controller
  static updateProfile = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const userId = req.user?._id;
      const updateData = req.body;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const updatedUser = await AuthService.updateProfileService(
        userId,
        updateData
      );

      successResponse(res, {
        statusCode: 200,
        message: "Profile updated successfully",
        payload: { data: updatedUser },
      });
    }
  );

  // Refresh token controller
  static refreshToken = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { refreshToken } = req.body;

      const result = await AuthService.refreshTokenService(refreshToken);

      successResponse(res, {
        statusCode: 200,
        message: "Tokens refreshed successfully",
        payload: { data: result },
      });
    }
  );
}

export default AuthController;
