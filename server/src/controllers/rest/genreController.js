import { genreService } from "../../services/genreService.js";

export const genreController = {
  async list(req, res, next) {
    try {
      const genres = await genreService.list();
      return res.json({ genres });
    } catch (error) {
      return next(error);
    }
  }
};
