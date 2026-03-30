import { Book } from "../models/Book.js";

function buildPublicFilter({ search, genreId, includeInactive }) {
  const filter = {};

  if (!includeInactive) {
    filter.active = true;
  }

  if (genreId) {
    filter.genre = genreId;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { author: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  return filter;
}

export const bookRepository = {
  findAll(filters) {
    const mongoFilter = buildPublicFilter(filters);
    return Book.find(mongoFilter).populate("genre").sort({ createdAt: -1 });
  },

  findById(id) {
    return Book.findById(id).populate("genre");
  },

  create(payload) {
    return Book.create(payload).then((book) => book.populate("genre"));
  },

  updateById(id, payload) {
    return Book.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).populate("genre");
  },

  deleteById(id) {
    return Book.findByIdAndDelete(id);
  }
};
