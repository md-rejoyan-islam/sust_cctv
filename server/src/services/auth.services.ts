import createError from "http-errors";
import secret from "../app/secret";
import { UserModel } from "../models/user.model";
import generateToken, { verifyToken } from "../utils/generate-token";
import { comparePassword } from "../utils/password";

export class AuthService {
  // Login service
  static async loginService(email: string, password: string) {
    // Find user by email and include password field
    const user = await UserModel.findOne({ email }).select("+password").lean();

    if (!user) {
      throw createError.BadRequest("Invalid email or password");
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw createError.BadRequest("Invalid email or password");
    }

    const payload = {
      _id: user._id.toString(),
      role: user.role,
      loginCode: Date.now(),
    };

    // Generate access token
    const access_token = generateToken(payload, {
      secret: secret.jwt.secret,
      expiresIn: secret.jwt.expiresIn,
    });

    // Generate refresh token
    const refresh_token = generateToken(payload, {
      secret: secret.jwt.refreshSecret,
      expiresIn: secret.jwt.refreshExpiresIn,
    });

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      access_token,
      refresh_token,
      expiresIn: secret.jwt.expiresIn,
    };
  }

  // Get current user service
  static async getCurrentUserService(userId: string) {
    const user = await UserModel.findById(userId).lean();

    if (!user) {
      throw createError.NotFound("User not found");
    }

    return user;
  }

  // Change password service
  static async changePasswordService(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Find user with password field
    const user = await UserModel.findById(userId).select("+password");

    if (!user) {
      throw createError.NotFound("User not found");
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      throw createError.BadRequest("Current password is incorrect");
    }

    // Check if new password is different from current password
    const isSamePassword = await comparePassword(newPassword, user.password);

    if (isSamePassword) {
      throw createError.BadRequest(
        "New password must be different from current password"
      );
    }

    user.password = newPassword;
    await user.save();
  }

  // Update profile service
  static async updateProfileService(
    userId: string,
    updateData: { name?: string; email?: string }
  ) {
    // Find user
    const user = await UserModel.findById(userId);

    if (!user) {
      throw createError.NotFound("User not found");
    }

    // Check if email is being updated and if it's already taken
    if (updateData.email && updateData.email !== user.email) {
      const emailExists = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: userId },
      });

      if (emailExists) {
        throw createError.Conflict("Email is already taken");
      }
    }

    // Update user profile
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    return updatedUser;
  }

  // Refresh token service
  static async refreshTokenService(refreshToken: string) {
    try {
      // Verify refresh token
      const decoded = verifyToken(refreshToken, secret.jwt.refreshSecret);

      // Find user to ensure they still exist
      const user = await UserModel.findById(decoded._id).lean();

      if (!user) {
        throw createError.NotFound("User not found");
      }

      const payload = {
        _id: user._id.toString(),
        role: user.role,
        loginCode: Date.now(),
      };

      // Generate new access token
      const newAccessToken = generateToken(payload, {
        secret: secret.jwt.secret,
        expiresIn: Number(secret.jwt.expiresIn),
      });

      // Generate new refresh token
      const newRefreshToken = generateToken(payload, {
        secret: secret.jwt.refreshSecret,
        expiresIn: Number(secret.jwt.refreshExpiresIn),
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: Number(secret.jwt.expiresIn),
      };
    } catch (error) {
      throw createError.Unauthorized("Invalid or expired refresh token");
    }
  }
}

export default AuthService;
