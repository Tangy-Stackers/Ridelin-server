const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rideSchema = new Schema(
  {
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    travelDate: { type: Date },
    startTime: { type: String },
    endTime: { type: String },
    distance: { type: String },
    driverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: { type: String },
    licensePlate: { type: String },
    music: { type: Boolean, default: false },
    smokingAllowed: { type: Boolean, default: false },
    petsAllowed: { type: Boolean, default: false },
    waypoints: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = model("Ride", rideSchema);
