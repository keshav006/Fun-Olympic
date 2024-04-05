import { Router } from "express";
import schemaValidator from "../middleware/schemaValidator.js";
import { validateToken } from "../middleware/auth.middleware.js";
import * as commentController from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.post(
  "/",
  validateToken,
  schemaValidator("/comment/create"),
  commentController.createOne
);

commentRouter.post(
  "/get-comments",
  validateToken,
  schemaValidator("/comment/get-comments"),
  commentController.findOne
);

commentRouter.delete("/:id", validateToken, commentController.deleteOne);

export default commentRouter;
