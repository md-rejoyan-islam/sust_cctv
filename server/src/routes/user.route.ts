import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authorize } from "../middlewares/authorized";
import validate from "../middlewares/validate";
import { isLoggedIn } from "../middlewares/verify";
import { UserValidator } from "../validator/user.validator";

const userRouter = Router();

// All routes require authentication
userRouter.use(isLoggedIn);

/**
 * @route GET /users
 * @desc Get all users with pagination and filters
 * @query page?: number, limit?: number, role?: 'admin'|'user', search?: string
 * @access Private (All authenticated users)
 */
userRouter.get(
  "/",
  validate(UserValidator.getAllUsersSchema),
  UserController.getAllUsers
);

/**
 * @route POST /users
 * @desc Create a new user
 * @body { name: string, email: string, password: string, role: 'admin'|'user' }
 * @access Private (Admin only)
 */
userRouter.post(
  "/",
  authorize(["admin"]),
  validate(UserValidator.createUserSchema),
  UserController.createUser
);

/**
 * @route GET /users/:id
 * @desc Get user by ID
 * @params id: string
 * @access Private (All authenticated users)
 */
userRouter.get(
  "/:id",
  validate(UserValidator.userIdParamSchema),
  UserController.getUserById
);

/**
 * @route PUT /users/:id
 * @desc Update user profile
 * @params id: string
 * @body { name?: string, email?: string, role?: 'admin'|'user' }
 * @access Private (Own profile or Admin)
 */
userRouter.put(
  "/:id",
  validate(UserValidator.updateUserSchema),
  UserController.updateUser
);

/**
 * @route DELETE /users/:id
 * @desc Delete user
 * @params id: string
 * @access Private (Admin only, cannot delete self)
 */
userRouter.delete(
  "/:id",
  authorize(["admin"]),
  validate(UserValidator.userIdParamSchema),
  UserController.deleteUser
);

/**
 * @route PATCH /users/:id/change-password
 * @desc Change user password (Admin function)
 * @params id: string
 * @body { newPassword: string }
 * @access Private (Admin only, cannot change own password)
 */
userRouter.patch(
  "/:id/change-password",
  authorize(["admin"]),
  validate(UserValidator.changeUserPasswordSchema),
  UserController.changeUserPassword
);

export default userRouter;
