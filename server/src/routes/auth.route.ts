import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import validate from "../middlewares/validate";
import { isLoggedIn } from "../middlewares/verify";
import { AuthValidator } from "../validator/auth.validator";

const authRouter = Router();

/**
 * @route POST /auth/login
 * @desc Login user
 * @body { email: string, password: string }
 * @response { user: object, accessToken: string, refreshToken: string, expiresIn: number }
 */
authRouter.post(
  "/login",
  validate(AuthValidator.loginSchema),
  AuthController.authLogin
);

/**
 * @route POST /auth/refresh
 * @desc Refresh access token using refresh token
 * @body { refreshToken: string }
 * @response { accessToken: string, refreshToken: string, expiresIn: number }
 */
authRouter.post(
  "/refresh",
  validate(AuthValidator.refreshTokenSchema),
  AuthController.refreshToken
);

/**
 * @route GET /auth/me
 * @desc Get current user profile
 * @headers Authorization: Bearer <token>
 * @response { user: object }
 */
authRouter.get("/me", isLoggedIn, AuthController.getMe);

/**
 * @route PUT /auth/me
 * @desc Update current user profile
 * @headers Authorization: Bearer <token>
 * @body { name?: string, email?: string }
 * @response { user: object }
 */

authRouter.put(
  "/me",
  isLoggedIn,
  validate(AuthValidator.updateProfileSchema),
  AuthController.updateProfile
);

/**
 * @route PATCH /auth/change-password
 * @desc Change user password
 * @headers Authorization: Bearer <token>
 * @body { currentPassword: string, newPassword: string }
 * @response { message: string }
 */
authRouter.patch(
  "/change-password",
  isLoggedIn,
  validate(AuthValidator.changePasswordSchema),
  AuthController.changePassword
);

export default authRouter;
