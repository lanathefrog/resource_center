import { reservationRepository } from "../repositories/reservationRepository.js";
import { bookRepository } from "../repositories/bookRepository.js";
import { sseBroker } from "../utils/sseBroker.js";

export const reservationService = {
  async listMy(userId) {
    return reservationRepository.findByUser(userId);
  },

  async reserve(bookId, userId) {
    const book = await bookRepository.findById(bookId);
    if (!book) {
      throw new Error("Book not found");
    }

    if (!book.active) {
      throw new Error("Book is not available for reservation");
    }

    const existing = await reservationRepository.findByBook(bookId);
    if (existing) {
      throw new Error("Book is already reserved");
    }

    const reservation = await reservationRepository.create({
      user: userId,
      book: bookId
    });

    await bookRepository.updateById(bookId, { active: false });
    sseBroker.broadcast("books:changed", { reason: "reserved", id: bookId });
    return reservation;
  },

  async cancel(reservationId, userId) {
    const reservation = await reservationRepository.findById(reservationId);
    const reservationUserId = reservation?.user?._id?.toString() || reservation?.user?.toString();
    if (!reservation || reservationUserId !== userId.toString()) {
      throw new Error("Reservation not found");
    }

    const bookId = reservation.book?._id?.toString() || reservation.book?.toString();
    await reservationRepository.deleteById(reservationId);
    await bookRepository.updateById(bookId, { active: true });

    sseBroker.broadcast("books:changed", { reason: "reservation-cancelled", id: bookId });
    return reservation;
  }
};
