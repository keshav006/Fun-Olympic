import { Router } from "express";
import {
  checkRole,
  validateOtp,
  validateToken,
} from "../middleware/auth.middleware.js";
import schemaValidator from "../middleware/schemaValidator.js";
import * as authController from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  schemaValidator("/auth/signup"),
  validateOtp,
  authController.signUp
);

authRouter.post(
  "/signin",
  schemaValidator("/auth/signin"),
  authController.signIn
);

authRouter.post(
  "/send-otp",
  schemaValidator("/auth/send-signup-otp"),
  authController.sendSignupOtp
);

authRouter.post(
  "/send-reset-otp",
  schemaValidator("/auth/send-reset-otp"),
  authController.sendResetOtp
);

authRouter.get(
  "/reset-request",
  validateToken,
  checkRole("admin"),
  authController.resetRequest
);

authRouter.post(
  "/verify-reset-otp",
  schemaValidator("/auth/verify-reset-otp"),
  validateOtp,
  authController.verifyResetOtp
);

authRouter.post(
  "/reset-password",
  schemaValidator("/auth/reset-password"),
  validateToken,
  checkRole("admin"),
  authController.changePassword
);

export default authRouter;
