import { param } from "express-validator";

export const reservationIdParamValidator = [
  param("id").isMongoId().withMessage("Invalid reservation identifier")
];

export const reservationBookIdParamValidator = [
  param("bookId").isMongoId().withMessage("Invalid book identifier")
];
