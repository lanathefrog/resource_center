import bcrypt from "bcryptjs";
import { userRepository } from "../repositories/userRepository.js";
import { tokenService } from "./tokenService.js";
import { emailService } from "./emailService.js";
import { ROLES } from "../constants/roles.js";

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified
  };
}

export const authService = {
  async register(payload) {
    const existing = await userRepository.findByEmail(payload.email);
    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const passwordHash = await bcrypt.hash(payload.password, 12);
    const token = tokenService.createVerificationToken();

    const user = await userRepository.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.toLowerCase(),
      passwordHash,
      role: ROLES.USER,
      isEmailVerified: false,
      emailVerificationToken: token,
      emailVerificationExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24)
    });

    await emailService.sendVerificationEmail({
      to: user.email,
      firstName: user.firstName,
      token
    });

    return sanitizeUser(user);
  },

  async verifyEmail(token) {
    const user = await userRepository.findByVerificationToken(token);

    if (!user) {
      throw new Error("Invalid verification token");
    }

    if (!user.emailVerificationExpiresAt || user.emailVerificationExpiresAt < new Date()) {
      throw new Error("Verification token has expired");
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpiresAt = null;

    await userRepository.save(user);

    return sanitizeUser(user);
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new Error("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new Error("Please verify your email before logging in");
    }

    return sanitizeUser(user);
  },

  async updateProfile(userId, payload) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.firstName = payload.firstName.trim();
    user.lastName = payload.lastName.trim();
    await userRepository.save(user);

    return sanitizeUser(user);
  },

  async changePassword(userId, payload) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isCurrentPasswordValid = await bcrypt.compare(payload.currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new Error("Current password is incorrect");
    }

    if (payload.currentPassword === payload.newPassword) {
      throw new Error("New password must be different from the current password");
    }

    user.passwordHash = await bcrypt.hash(payload.newPassword, 12);
    await userRepository.save(user);

    return sanitizeUser(user);
  },

  async getMe(userId) {
    if (!userId) {
      return null;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      return null;
    }

    return sanitizeUser(user);
  },

  async ensureAdminExists({ email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await userRepository.create({
      firstName: "System",
      lastName: "Admin",
      email: email.toLowerCase(),
      passwordHash,
      role: ROLES.ADMIN,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null
    });

    console.log(`Admin user created: ${email}`);
  },

  async ensureDemoUserExists({ email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await userRepository.create({
      firstName: "Demo",
      lastName: "User",
      email: email.toLowerCase(),
      passwordHash,
      role: ROLES.USER,
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiresAt: null
    });

    console.log(`Demo user created: ${email}`);
  }
};
