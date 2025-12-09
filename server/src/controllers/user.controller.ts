import { Request, Response } from "express";
import { IRequestWithUser } from "../app/types";
import { UserService } from "../services/user.services";
import { asyncHandler } from "../utils/async-handler";
import { successResponse } from "../utils/response-handler";

export class UserController {
  // Get all users controller
  static getAllUsers = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { page, limit, role, search } = req.query;

      const result = await UserService.getAllUsersService({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 30,
        role: role as string,
        search: search as string,
      });

      successResponse(res, {
        statusCode: 200,
        message: "Users fetched successfully",
        payload: result,
      });
    }
  );

  // Get user by ID controller
  static getUserById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const user = await UserService.getUserByIdService(id);

      successResponse(res, {
        statusCode: 200,
        message: "User fetched successfully",
        payload: { data: user },
      });
    }
  );

  // Create user controller
  static createUser = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { name, email, password, role } = req.body;

      const newUser = await UserService.createUserService({
        name,
        email,
        password,
        role,
      });

      successResponse(res, {
        statusCode: 201,
        message: "User created successfully",
        payload: { data: newUser },
      });
    }
  );

  // Update user controller
  static updateUser = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateData = req.body;

      // Check if user is trying to update their own account or if they're admin
      const currentUser = req.user;
      if (currentUser?._id !== id && currentUser?.role !== "admin") {
        throw new Error(
          "You can only update your own profile or you must be an admin"
        );
      }

      const updatedUser = await UserService.updateUserService(id, updateData);

      successResponse(res, {
        statusCode: 200,
        message: "User updated successfully",
        payload: { data: updatedUser },
      });
    }
  );

  // Delete user controller
  static deleteUser = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const { id } = req.params;
      const currentUser = req.user;

      // Prevent users from deleting themselves
      if (currentUser?._id === id) {
        throw new Error("You cannot delete your own account");
      }

      // Only admins can delete users
      if (currentUser?.role !== "admin") {
        throw new Error("Only administrators can delete users");
      }

      await UserService.deleteUserService(id);

      successResponse(res, {
        statusCode: 200,
        message: "User deleted successfully",
      });
    }
  );

  // Change user password controller (admin function)
  static changeUserPassword = asyncHandler(
    async (req: IRequestWithUser, res: Response): Promise<void> => {
      const { id } = req.params;
      const { newPassword } = req.body;
      const currentUser = req.user;

      // Only admins can change other users' passwords
      if (currentUser?.role !== "admin") {
        throw new Error("Only administrators can change user passwords");
      }

      // Prevent changing own password through this route
      if (currentUser._id === id) {
        throw new Error(
          "Use the change-password route to change your own password"
        );
      }

      const result = await UserService.changeUserPasswordService(
        id,
        newPassword
      );

      successResponse(res, {
        statusCode: 200,
        message: result.message,
      });
    }
  );
}

export default UserController;
