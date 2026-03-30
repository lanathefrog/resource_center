import { authService } from "../../services/authService.js";

export const authController = {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json({
        message: "Registration successful. Check your email to verify your account.",
        user
      });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async verifyEmail(req, res, next) {
    try {
      const user = await authService.verifyEmail(req.query.token);
      return res.json({ message: "Email verified", user });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async login(req, res, next) {
    try {
      const user = await authService.login(req.body);
      req.session.userId = user.id;
      req.session.role = user.role;

      return res.json({ message: "Login successful", user });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async logout(req, res, next) {
    req.session.destroy((err) => {
      if (err) {
        return next({ status: 500, message: "Failed to end session" });
      }

      res.clearCookie("library.sid");
      return res.json({ message: "Logout successful" });
    });
  },

  async me(req, res, next) {
    try {
      const user = await authService.getMe(req.session?.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      return res.json({ user });
    } catch (error) {
      return next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await authService.updateProfile(req.session.userId, req.body);
      return res.json({ message: "Profile updated", user });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async changePassword(req, res, next) {
    try {
      await authService.changePassword(req.session.userId, req.body);
      return res.json({ message: "Password updated" });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  }
};
