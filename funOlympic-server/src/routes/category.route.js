import { Router } from "express";
import schemaValidator from "../middleware/schemaValidator.js";
import * as categoryController from "../controllers/category.controller.js";
import { checkRole, validateToken } from "../middleware/auth.middleware.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.findAll);

categoryRouter.get("/:id", categoryController.findOne);

categoryRouter.post(
  "/",
  validateToken,
  schemaValidator("/category/create"),
  checkRole("admin"),
  categoryController.createOne
);

categoryRouter.patch(
  "/:id",
  validateToken,
  schemaValidator("/category/update"),
  checkRole("admin"),
  categoryController.updateOne
);

categoryRouter.delete(
  "/:id",
  validateToken,
  checkRole("admin"),
  categoryController.deleteOne
);

export default categoryRouter;
