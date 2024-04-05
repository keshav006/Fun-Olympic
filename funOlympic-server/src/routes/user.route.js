import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import schemaValidator from "../middleware/schemaValidator.js";
import { checkRole, validateToken } from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get(
  "/",
  validateToken,
  checkRole("admin"),
  userController.getAllUser
);

userRouter.post(
  "/",
  validateToken,
  schemaValidator("/auth/signup"),
  userController.createUser
);

userRouter.get("/:id", validateToken, userController.getUserById);

userRouter.delete(
  "/:id",
  validateToken,
  checkRole("admin"),
  userController.deleteUser
);

export default userRouter;
