import { Reservation } from "../models/Reservation.js";

export const reservationRepository = {
  findByUser(userId) {
    return Reservation.find({ user: userId })
      .populate("user")
      .populate({ path: "book", populate: { path: "genre" } })
      .sort({ createdAt: -1 });
  },

  findByBook(bookId) {
    return Reservation.findOne({ book: bookId });
  },

  findById(id) {
    return Reservation.findById(id)
      .populate("user")
      .populate({ path: "book", populate: { path: "genre" } });
  },

  create(payload) {
    return Reservation.create(payload).then((reservation) =>
      reservation.populate(["user", { path: "book", populate: { path: "genre" } }])
    );
  },

  deleteById(id) {
    return Reservation.findByIdAndDelete(id);
  }
};
