import { Router } from "express";
import schemaValidator from "../middleware/schemaValidator.js";
import { checkRole, validateToken } from "../middleware/auth.middleware.js";
import * as eventController from "../controllers/event.controller.js";

const eventRouter = Router();

eventRouter.get("/", eventController.findAll);

eventRouter.get("/:id", eventController.findOne);

eventRouter.post(
  "/",
  validateToken,
  schemaValidator("/event/create"),
  checkRole("admin"),
  eventController.createOne
);

eventRouter.patch(
  "/:id",
  validateToken,
  schemaValidator("/event/update"),
  checkRole("admin"),
  eventController.updateOne
);

eventRouter.delete(
  "/:id",
  validateToken,
  checkRole("admin"),
  eventController.deleteOne
);
export default eventRouter;
