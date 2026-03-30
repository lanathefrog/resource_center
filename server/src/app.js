import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import session from "express-session";
import MongoStore from "connect-mongo";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { env, isProd } from "./config/env.js";
import { authRouter } from "./routes/rest/authRoutes.js";
import { bookRouter } from "./routes/rest/bookRoutes.js";
import { genreRouter } from "./routes/rest/genreRoutes.js";
import { reservationRouter } from "./routes/rest/reservationRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { typeDefs } from "./graphql/typeDefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { buildContext } from "./graphql/context.js";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isProd ? 150 : 1500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS" || req.path === "/api/health"
});

export async function buildApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true
    })
  );
  app.use(limiter);

  app.use(express.json({ limit: "1mb" }));

  app.use(
    session({
      name: "library.sid",
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: env.mongodbUri,
        collectionName: "sessions"
      }),
      cookie: {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7
      }
    })
  );

  app.get("/api/health", (_, res) => {
    res.json({ ok: true, service: "library-api" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/books", bookRouter);
  app.use("/api/genres", genreRouter);
  app.use("/api/reservations", reservationRouter);

  const apollo = new ApolloServer({
    typeDefs,
    resolvers
  });

  await apollo.start();

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(apollo, {
      context: buildContext
    })
  );

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
