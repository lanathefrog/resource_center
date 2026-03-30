import crypto from "crypto";

export const tokenService = {
  createVerificationToken() {
    return crypto.randomUUID();
  }
};
