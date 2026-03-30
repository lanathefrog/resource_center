import { authService } from "../services/authService.js";
import { bookService } from "../services/bookService.js";
import { genreService } from "../services/genreService.js";
import { reservationService } from "../services/reservationService.js";
import { ROLES } from "../constants/roles.js";

function ensureAdmin(session) {
  if (!session?.userId || session?.role !== ROLES.ADMIN) {
    throw new Error("Insufficient permissions");
  }
}

function ensureAuthenticated(session) {
  if (!session?.userId) {
    throw new Error("Unauthorized");
  }
}

function ensureUser(session) {
  if (!session?.userId || session?.role !== ROLES.USER) {
    throw new Error("Insufficient permissions");
  }
}

export const resolvers = {
  Query: {
    me: async (_, __, { req }) => authService.getMe(req.session?.userId),
    genres: async () => genreService.list(),
    books: async (_, args, { req }) =>
      bookService.list({
        search: args.search || "",
        genreId: args.genreId || "",
        includeInactive: req.session?.role === ROLES.ADMIN
      }),
    book: async (_, { id }) => bookService.getById(id),
    myReservations: async (_, __, { req }) => {
      ensureUser(req.session);
      return reservationService.listMy(req.session.userId);
    }
  },
  Mutation: {
    register: async (_, { input }) => {
      const user = await authService.register(input);
      return { message: "Registration successful", user };
    },
    verifyEmail: async (_, { token }) => {
      const user = await authService.verifyEmail(token);
      return { message: "Email verified", user };
    },
    login: async (_, { input }, { req }) => {
      const user = await authService.login(input);
      req.session.userId = user.id;
      req.session.role = user.role;
      return { message: "Login successful", user };
    },
    logout: async (_, __, { req, res }) => {
      await new Promise((resolve, reject) => {
        req.session.destroy((err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      });

      res.clearCookie("library.sid");
      return { message: "Logout successful", user: null };
    },
    updateProfile: async (_, { input }, { req }) => {
      ensureAuthenticated(req.session);
      const user = await authService.updateProfile(req.session.userId, input);
      return { message: "Profile updated", user };
    },
    changePassword: async (_, { input }, { req }) => {
      ensureAuthenticated(req.session);
      await authService.changePassword(req.session.userId, input);
      const user = await authService.getMe(req.session.userId);
      return { message: "Password updated", user };
    },
    createBook: async (_, { input }, { req }) => {
      ensureAdmin(req.session);
      const book = await bookService.create(input, req.session.userId);
      return { message: "Book created", book };
    },
    updateBook: async (_, { id, input }, { req }) => {
      ensureAdmin(req.session);
      const book = await bookService.update(id, input);
      return { message: "Book updated", book };
    },
    deleteBook: async (_, { id }, { req }) => {
      ensureAdmin(req.session);
      const book = await bookService.remove(id);
      return { message: "Book deleted", book };
    },
    toggleBookActive: async (_, { id }, { req }) => {
      ensureAdmin(req.session);
      const book = await bookService.toggleActive(id);
      return { message: "Book status updated", book };
    },
    reserveBook: async (_, { bookId }, { req }) => {
      ensureUser(req.session);
      const reservation = await reservationService.reserve(bookId, req.session.userId);
      return { message: "Book reserved", reservation };
    },
    cancelReservation: async (_, { id }, { req }) => {
      ensureUser(req.session);
      const reservation = await reservationService.cancel(id, req.session.userId);
      return { message: "Reservation cancelled", reservation };
    }
  },
  Book: {
    id: (book) => book._id.toString(),
    genre: (book) => book.genre
  },
  Genre: {
    id: (genre) => genre._id.toString()
  },
  Reservation: {
    id: (reservation) => reservation._id.toString()
  },
  User: {
    id: (user) => user.id || user._id.toString()
  }
};
