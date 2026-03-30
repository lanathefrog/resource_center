import { reservationService } from "../../services/reservationService.js";

export const reservationController = {
  async listMy(req, res, next) {
    try {
      const reservations = await reservationService.listMy(req.session.userId);
      return res.json({ reservations });
    } catch (error) {
      return next(error);
    }
  },

  async reserve(req, res, next) {
    try {
      const reservation = await reservationService.reserve(req.params.bookId, req.session.userId);
      return res.status(201).json({ message: "Book reserved", reservation });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async cancel(req, res, next) {
    try {
      const reservation = await reservationService.cancel(req.params.id, req.session.userId);
      return res.json({ message: "Reservation cancelled", reservation });
    } catch (error) {
      return next({ status: 404, message: error.message });
    }
  }
};
