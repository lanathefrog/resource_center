import { Router } from "express";
import { authController } from "../../controllers/rest/authController.js";
import { validate } from "../../middleware/validate.js";
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
  updateProfileValidator,
  verifyEmailValidator
} from "../../validators/authValidators.js";
import { requireAuth } from "../../middleware/authMiddleware.js";

export const authRouter = Router();

authRouter.post("/register", registerValidator, validate, authController.register);
authRouter.get("/verify-email", verifyEmailValidator, validate, authController.verifyEmail);
authRouter.post("/login", loginValidator, validate, authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", authController.me);
authRouter.patch("/profile", requireAuth, updateProfileValidator, validate, authController.updateProfile);
authRouter.patch("/password", requireAuth, changePasswordValidator, validate, authController.changePassword);
