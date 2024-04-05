import { Router } from "express";
import { validateToken } from "../middleware/auth.middleware.js";
import * as messageController from "../controllers/message.controller.js";
import schemaValidator from "../middleware/schemaValidator.js";

const messageRouter = Router();

messageRouter.post(
  "/",
  validateToken,
  schemaValidator("/message/create"),
  messageController.createOne
);
messageRouter.get("/", messageController.findAll);

export default messageRouter;
