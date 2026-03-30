import { body, query } from "express-validator";

export const registerValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
];

export const loginValidator = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required")
];

export const verifyEmailValidator = [
  query("token").notEmpty().withMessage("Verification token is required")
];

export const updateProfileValidator = [
  body("firstName").trim().notEmpty().withMessage("First name is required"),
  body("lastName").trim().notEmpty().withMessage("Last name is required")
];

export const changePasswordValidator = [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
];
