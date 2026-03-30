import { genreRepository } from "../repositories/genreRepository.js";

export const genreService = {
  async list() {
    return genreRepository.findAll();
  },

  async findOrCreate(name) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Genre name is required");
    let genre = await genreRepository.findByName(trimmed);
    if (!genre) genre = await genreRepository.create(trimmed);
    return genre;
  }
};
