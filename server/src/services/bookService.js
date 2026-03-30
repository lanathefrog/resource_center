import { bookRepository } from "../repositories/bookRepository.js";
import { genreService } from "./genreService.js";
import { sseBroker } from "../utils/sseBroker.js";

export const bookService = {
  async list(filters) {
    return bookRepository.findAll(filters);
  },

  async getById(id) {
    const book = await bookRepository.findById(id);
    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  },

  async create(payload, userId) {
    const { genreName, ...rest } = payload;
    const genre = await genreService.findOrCreate(genreName);
    const book = await bookRepository.create({
      ...rest,
      genre: genre._id,
      createdBy: userId
    });

    sseBroker.broadcast("books:changed", { reason: "created", id: book._id.toString() });
    return book;
  },

  async update(id, payload) {
    const { genreName, ...rest } = payload;
    const updateData = { ...rest };
    if (genreName) {
      const genre = await genreService.findOrCreate(genreName);
      updateData.genre = genre._id;
    }
    const book = await bookRepository.updateById(id, updateData);
    if (!book) {
      throw new Error("Book not found");
    }

    sseBroker.broadcast("books:changed", { reason: "updated", id: book._id.toString() });
    return book;
  },

  async remove(id) {
    const book = await bookRepository.deleteById(id);
    if (!book) {
      throw new Error("Book not found");
    }

    sseBroker.broadcast("books:changed", { reason: "deleted", id: book._id.toString() });
    return book;
  },

  async toggleActive(id) {
    const current = await bookRepository.findById(id);
    if (!current) {
      throw new Error("Book not found");
    }

    const updated = await bookRepository.updateById(id, { active: !current.active });
    sseBroker.broadcast("books:changed", { reason: "toggled", id: updated._id.toString() });
    return updated;
  }
};
