import { bookService } from "../../services/bookService.js";
import { sseBroker } from "../../utils/sseBroker.js";

export const bookController = {
  async list(req, res, next) {
    try {
      const books = await bookService.list({
        search: req.query.search || "",
        genreId: req.query.genreId || "",
        includeInactive: req.session?.role === "admin"
      });

      return res.json({ books });
    } catch (error) {
      return next(error);
    }
  },

  async getById(req, res, next) {
    try {
      const book = await bookService.getById(req.params.id);
      return res.json({ book });
    } catch (error) {
      return next({ status: 404, message: error.message });
    }
  },

  async create(req, res, next) {
    try {
      const book = await bookService.create(req.body, req.session.userId);
      return res.status(201).json({ message: "Book created", book });
    } catch (error) {
      return next({ status: 400, message: error.message });
    }
  },

  async update(req, res, next) {
    try {
      const book = await bookService.update(req.params.id, req.body);
      return res.json({ message: "Book updated", book });
    } catch (error) {
      return next({ status: 404, message: error.message });
    }
  },

  async remove(req, res, next) {
    try {
      await bookService.remove(req.params.id);
      return res.json({ message: "Book deleted" });
    } catch (error) {
      return next({ status: 404, message: error.message });
    }
  },

  async toggleActive(req, res, next) {
    try {
      const book = await bookService.toggleActive(req.params.id);
      return res.json({ message: "Book status updated", book });
    } catch (error) {
      return next({ status: 404, message: error.message });
    }
  },

  streamEvents(req, res) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);
    sseBroker.addClient(res);

    req.on("close", () => {
      sseBroker.removeClient(res);
    });
  }
};
