import { request } from "./http";

export const restApi = {
  async register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async verifyEmail(token) {
    return request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`);
  },

  async login(payload) {
    return request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  },

  async logout() {
    return request("/api/auth/logout", { method: "POST" });
  },

  async me() {
    return request("/api/auth/me");
  },

  async updateProfile(payload) {
    return request("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  async changePassword(payload) {
    return request("/api/auth/password", {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  },

  async listGenres() {
    const data = await request("/api/genres");
    return data.genres;
  },

  async listBooks({ search = "", genreId = "" }) {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (genreId) params.set("genreId", genreId);

    const query = params.toString();
    const data = await request(`/api/books${query ? `?${query}` : ""}`);
    return data.books;
  },

  async createBook(payload) {
    const data = await request("/api/books", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return data.book;
  },

  async updateBook(id, payload) {
    const data = await request(`/api/books/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    return data.book;
  },

  async deleteBook(id) {
    await request(`/api/books/${id}`, { method: "DELETE" });
  },

  async toggleBookActive(id) {
    const data = await request(`/api/books/${id}/toggle-active`, { method: "PATCH" });
    return data.book;
  },

  async listMyReservations() {
    const data = await request("/api/reservations/me");
    return data.reservations;
  },

  async reserveBook(bookId) {
    const data = await request(`/api/reservations/${bookId}`, { method: "POST" });
    return data.reservation;
  },

  async cancelReservation(id) {
    const data = await request(`/api/reservations/${id}`, { method: "DELETE" });
    return data.reservation;
  }
};
