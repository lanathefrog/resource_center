export const typeDefs = `#graphql
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    isEmailVerified: Boolean!
  }

  type Genre {
    id: ID!
    name: String!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    genre: Genre!
    publishedYear: Int!
    description: String!
    active: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type AuthResponse {
    message: String!
    user: User
  }

  type BookResponse {
    message: String!
    book: Book
  }

  type Reservation {
    id: ID!
    user: User!
    book: Book!
    createdAt: String!
    updatedAt: String!
  }

  type ReservationResponse {
    message: String!
    reservation: Reservation
  }

  type Query {
    me: User
    genres: [Genre!]!
    books(search: String, genreId: ID): [Book!]!
    book(id: ID!): Book
    myReservations: [Reservation!]!
  }

  input RegisterInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input UpdateProfileInput {
    firstName: String!
    lastName: String!
  }

  input ChangePasswordInput {
    currentPassword: String!
    newPassword: String!
  }

  input BookInput {
    title: String!
    author: String!
    genreName: String!
    publishedYear: Int!
    description: String
    active: Boolean
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse!
    verifyEmail(token: String!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    logout: AuthResponse!
    updateProfile(input: UpdateProfileInput!): AuthResponse!
    changePassword(input: ChangePasswordInput!): AuthResponse!

    createBook(input: BookInput!): BookResponse!
    updateBook(id: ID!, input: BookInput!): BookResponse!
    deleteBook(id: ID!): BookResponse!
    toggleBookActive(id: ID!): BookResponse!
    reserveBook(bookId: ID!): ReservationResponse!
    cancelReservation(id: ID!): ReservationResponse!
  }
`;
