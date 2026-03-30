import { Router } from "express";
import { bookController } from "../../controllers/rest/bookController.js";
import { requireRole } from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import { validate } from "../../middleware/validate.js";
import {
  createBookValidator,
  idParamValidator,
  updateBookValidator
} from "../../validators/bookValidators.js";

export const bookRouter = Router();

bookRouter.get("/events/stream", bookController.streamEvents);
bookRouter.get("/", bookController.list);
bookRouter.get("/:id", idParamValidator, validate, bookController.getById);

bookRouter.post(
  "/",
  requireRole(ROLES.ADMIN),
  createBookValidator,
  validate,
  bookController.create
);

bookRouter.put(
  "/:id",
  requireRole(ROLES.ADMIN),
  updateBookValidator,
  validate,
  bookController.update
);

bookRouter.patch(
  "/:id/toggle-active",
  requireRole(ROLES.ADMIN),
  idParamValidator,
  validate,
  bookController.toggleActive
);

bookRouter.delete(
  "/:id",
  requireRole(ROLES.ADMIN),
  idParamValidator,
  validate,
  bookController.remove
);
