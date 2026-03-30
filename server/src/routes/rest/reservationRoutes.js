import { Router } from "express";
import { reservationController } from "../../controllers/rest/reservationController.js";
import { requireRole } from "../../middleware/roleMiddleware.js";
import { ROLES } from "../../constants/roles.js";
import { validate } from "../../middleware/validate.js";
import {
  reservationBookIdParamValidator,
  reservationIdParamValidator
} from "../../validators/reservationValidators.js";

export const reservationRouter = Router();

reservationRouter.get("/me", requireRole(ROLES.USER), reservationController.listMy);

reservationRouter.post(
  "/:bookId",
  requireRole(ROLES.USER),
  reservationBookIdParamValidator,
  validate,
  reservationController.reserve
);

reservationRouter.delete(
  "/:id",
  requireRole(ROLES.USER),
  reservationIdParamValidator,
  validate,
  reservationController.cancel
);
