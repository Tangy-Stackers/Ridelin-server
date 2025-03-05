const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const Ride = require("../models/Ride.model");
const Booking = require("../models/Booking.model");

// POST/book----> create a booking
router.post("/book", (req, res, next) => {
  //const { rideId, userId} = req.params;
  const newBooking = req.body;
  console.log(newBooking);
  const { ride, passengerId } = newBooking;

  Ride.findById(ride)
    .then((ride) => {
      if (!ride) {
        return res.status(400).json({ message: "Ride not found" });
      }
      return User.findById(passengerId);
    })
    .then((passenger) => {
      if (!passenger) {
        return res.status(402).json({ message: "Passenger not found" });
      }
      if (Ride.driverId === passengerId) {
        return res
          .status(400)
          .json({ message: "Passenger cannot be the rider" });
      }
      return Booking.create(newBooking);
    })
    .then(() => {
      res.status(201).json({ message: "Ride booked successfully" });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
});
//GET/book-----> get all the booking
router.get("/bookings", (req, res, next) => {
  Booking.find({})
    .populate("ride")
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    });
});
// GET/bookingId------> get a specific booking by ID
router.get("/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  Booking.findById(bookingId)
    .populate("ride")
    .then((booking) => {
      res.status(200).json(booking);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    });
});
// PATCH/bookingId-------> Update booking (e.g., update seatsBooked)
router.patch("/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const { seatsBooked, status } = req.body;

  Booking.findById(bookingId)
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      return Ride.findById(booking.ride).then((ride) => {
        // Check if there are seats available
        if (ride.seatsAvailable + booking.seatsBooked < seatsBooked) {
          return res
            .status(400)
            .json({ message: "Not enough seats available" });
        }
        // Update the number of seats booked
        const seatDifference = seatsBooked - booking.seatsBooked;
        // Update the booking with new seatsBooked and status if provided
        return Booking.findByIdAndUpdate(
          bookingId,
          {
            seatsBooked,
            status: status !== undefined ? status : booking.status,
          },
          { new: true }
        );
      });
    })
    .then((updatedBooking) => {
      res
        .status(200)
        .json({
          message: "Booking updated successfully",
          booking: updatedBooking,
        });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
});

// DELETE/bookingId---------->Cancel booking
router.delete("/:bookingId", async (req, res) => {
  const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(404).json({ message: "Booking not found" });
    }
     Booking.findByIdAndDelete(bookingId)
.then(() => {
  res.status(200).json({message: `Booking with ${bookingId} deleted successfully`})
})   
 .catch ((error) => {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  });
});

module.exports = router;
