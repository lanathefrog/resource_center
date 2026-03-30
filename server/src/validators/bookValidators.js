import { body, param } from "express-validator";

export const createBookValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("author").trim().notEmpty().withMessage("Author is required"),
  body("genreName").trim().notEmpty().withMessage("Genre is required"),
  body("publishedYear")
    .isInt({ min: 1000, max: 2100 })
    .withMessage("Published year must be between 1000 and 2100"),
  body("description").optional().isString()
];

export const updateBookValidator = [
  param("id").isMongoId().withMessage("Invalid identifier"),
  body("title").optional().trim().notEmpty(),
  body("author").optional().trim().notEmpty(),
  body("genreName").optional().trim().notEmpty(),
  body("publishedYear").optional().isInt({ min: 1000, max: 2100 }),
  body("description").optional().isString(),
  body("active").optional().isBoolean()
];

export const idParamValidator = [
  param("id").isMongoId().withMessage("Invalid identifier")
];
