import { Genre } from "../models/Genre.js";

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const genreRepository = {
  findAll() {
    return Genre.find().sort({ name: 1 });
  },

  findById(id) {
    return Genre.findById(id);
  },

  findByName(name) {
    return Genre.findOne({ name: new RegExp(`^${escapeRegex(name)}$`, "i") });
  },

  create(name) {
    return Genre.create({ name });
  }
};
