import { Router } from "express";
import { genreController } from "../../controllers/rest/genreController.js";

export const genreRouter = Router();

genreRouter.get("/", genreController.list);
