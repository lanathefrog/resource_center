import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

export const Reservation = mongoose.model("Reservation", reservationSchema);
