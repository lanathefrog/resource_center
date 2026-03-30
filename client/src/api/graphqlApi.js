import { graphRequest } from "./http";

export const graphqlApi = {
  async register(payload) {
    const data = await graphRequest(
      `mutation Register($input: RegisterInput!) {
        register(input: $input) {
          message
          user { id firstName lastName email role isEmailVerified }
        }
      }`,
      { input: payload }
    );

    return data.register;
  },

  async verifyEmail(token) {
    const data = await graphRequest(
      `mutation VerifyEmail($token: String!) {
        verifyEmail(token: $token) {
          message
          user { id firstName lastName email role isEmailVerified }
        }
      }`,
      { token }
    );

    return data.verifyEmail;
  },

  async login(payload) {
    const data = await graphRequest(
      `mutation Login($input: LoginInput!) {
        login(input: $input) {
          message
          user { id firstName lastName email role isEmailVerified }
        }
      }`,
      { input: payload }
    );

    return data.login;
  },

  async logout() {
    const data = await graphRequest(`mutation { logout { message } }`);
    return data.logout;
  },

  async me() {
    const data = await graphRequest(`query { me { id firstName lastName email role isEmailVerified } }`);
    return { user: data.me };
  },

  async updateProfile(payload) {
    const data = await graphRequest(
      `mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          message
          user { id firstName lastName email role isEmailVerified }
        }
      }`,
      { input: payload }
    );

    return data.updateProfile;
  },

  async changePassword(payload) {
    const data = await graphRequest(
      `mutation ChangePassword($input: ChangePasswordInput!) {
        changePassword(input: $input) {
          message
          user { id firstName lastName email role isEmailVerified }
        }
      }`,
      { input: payload }
    );

    return data.changePassword;
  },

  async listGenres() {
    const data = await graphRequest(`query { genres { id name } }`);
    return data.genres;
  },

  async listBooks({ search = "", genreId = "" }) {
    const data = await graphRequest(
      `query Books($search: String, $genreId: ID) {
        books(search: $search, genreId: $genreId) {
          id title author genre { id name } publishedYear description active createdAt updatedAt
        }
      }`,
      { search: search || null, genreId: genreId || null }
    );

    return data.books;
  },

  async createBook(payload) {
    const data = await graphRequest(
      `mutation CreateBook($input: BookInput!) {
        createBook(input: $input) {
          book { id title author genre { id name } publishedYear description active createdAt updatedAt }
        }
      }`,
      { input: payload }
    );
    return data.createBook.book;
  },

  async updateBook(id, payload) {
    const data = await graphRequest(
      `mutation UpdateBook($id: ID!, $input: BookInput!) {
        updateBook(id: $id, input: $input) {
          book { id title author genre { id name } publishedYear description active createdAt updatedAt }
        }
      }`,
      { id, input: payload }
    );
    return data.updateBook.book;
  },

  async deleteBook(id) {
    await graphRequest(
      `mutation DeleteBook($id: ID!) { deleteBook(id: $id) { message } }`,
      { id }
    );
  },

  async toggleBookActive(id) {
    const data = await graphRequest(
      `mutation ToggleBook($id: ID!) {
        toggleBookActive(id: $id) {
          book { id title author genre { id name } publishedYear description active createdAt updatedAt }
        }
      }`,
      { id }
    );
    return data.toggleBookActive.book;
  },

  async listMyReservations() {
    const data = await graphRequest(
      `query {
        myReservations {
          id
          createdAt
          book {
            id
            title
            author
            genre { id name }
            publishedYear
            description
            active
            createdAt
            updatedAt
          }
        }
      }`
    );
    return data.myReservations;
  },

  async reserveBook(bookId) {
    const data = await graphRequest(
      `mutation ReserveBook($bookId: ID!) {
        reserveBook(bookId: $bookId) {
          reservation {
            id
            createdAt
            book {
              id
              title
              author
              genre { id name }
              publishedYear
              description
              active
              createdAt
              updatedAt
            }
          }
        }
      }`,
      { bookId }
    );
    return data.reserveBook.reservation;
  },

  async cancelReservation(id) {
    const data = await graphRequest(
      `mutation CancelReservation($id: ID!) {
        cancelReservation(id: $id) {
          reservation { id }
        }
      }`,
      { id }
    );
    return data.cancelReservation.reservation;
  }
};
