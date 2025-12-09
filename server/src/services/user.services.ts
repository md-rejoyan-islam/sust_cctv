import createError from "http-errors";
import { IUserSchema } from "../app/types";
import { UserModel } from "../models/user.model";
import { isValidMongoId } from "../utils/validate-mongo-id";

export class UserService {
  // Get all users service
  static async getAllUsersService(query: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
  }) {
    const { page = 1, limit = 10, role, search } = query;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: {
      role?: string;
      $or?: [
        { name: { $regex: string; $options: string } },
        { email: { $regex: string; $options: string } }
      ];
    } = {};

    if (role && (role === "admin" || role === "user")) {
      filter.role = role;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get users with pagination
    const users = await UserModel.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const totalUsers = await UserModel.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / Number(limit));

    return {
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        items: totalUsers,
        limit: Number(limit),
      },
    };
  }

  // Get user by ID service
  static async getUserByIdService(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid user ID format");
    }

    const user = await UserModel.findById(id).select("-password").lean();

    if (!user) {
      throw createError.NotFound("User not found");
    }

    return user;
  }

  // Create user service
  static async createUserService(userData: IUserSchema) {
    const { email, name, password, role } = userData;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email }).lean();

    if (existingUser) {
      throw createError.Conflict("User with this email already exists");
    }

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password,
      role,
    });

    await newUser.save();

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  // Update user service
  static async updateUserService(
    id: string,
    updateData: Partial<Pick<IUserSchema, "name" | "email" | "role">>
  ) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid user ID format");
    }

    // Check if user exists
    const existingUser = await UserModel.findById(id);
    if (!existingUser) {
      throw createError.NotFound("User not found");
    }

    // If email is being updated, check if it's already taken
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await UserModel.findOne({ email: updateData.email });
      if (emailExists) {
        throw createError.Conflict("Email is already taken");
      }
    }

    // Update user
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    return updatedUser;
  }

  // Delete user service
  static async deleteUserService(id: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid user ID format");
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw createError.NotFound("User not found");
    }

    await UserModel.findByIdAndDelete(id);
  }

  // Change user password service (admin function)
  static async changeUserPasswordService(id: string, newPassword: string) {
    if (!isValidMongoId(id)) {
      throw createError.BadRequest("Invalid user ID format");
    }

    const user = await UserModel.findById(id);
    if (!user) {
      throw createError.NotFound("User not found");
    }

    user.password = newPassword;
    await user.save();

    return { message: "User password changed successfully" };
  }
}

export default UserService;
