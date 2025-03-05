const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rideSchema = new Schema({
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
      driverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    }, { timestamps: true });

module.exports = model("Ride", rideSchema);


