import { User } from "../models/User.js";

export const userRepository = {
  findByEmail(email) {
    return User.findOne({ email: email.toLowerCase() });
  },

  findById(id) {
    return User.findById(id);
  },

  create(payload) {
    return User.create(payload);
  },

  findByVerificationToken(token) {
    return User.findOne({ emailVerificationToken: token });
  },

  save(userDoc) {
    return userDoc.save();
  }
};
