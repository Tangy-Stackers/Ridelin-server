const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ride: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
    },
    /* totalPrice: {
        type: Number,  // If you want to calculate ride fare
        default: 0
      }*/
  },
  { timestamps: true }
);

  module.exports = model("Booking", bookingSchema);
