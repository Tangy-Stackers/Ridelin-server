const express = require("express");
const mongoose = require("mongoose");
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

// router.post("/book", async (req, res) => {
//   try {
//     const {passengerId, ride} = req.body

//     const foundRide = await Ride.findById(ride)
//     const rider = await User.findById(passengerId)

//     if(!foundRide || ride.driverId === passengerId){
//       return res.status(500).json({msg: "Ride not found or driver cant be passenger"})
//     }

//     const createdBooking = await Booking.create({...req.body, bookingDate: foundRide.travelDate})

//     return res.status(201).json(createdBooking)
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json(error)
//   }
// })

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
router.get("/bookings/:bookingId", (req, res) => {

  const { bookingId } = req.params;
  console.log("bookingid::", bookingId);

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ error: "Invalid booking ID format" });
  }
  Booking.findById(bookingId)
    .populate("ride")
    .then((booking) => {
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }
      res.status(200).json(booking);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    });
});
// PATCH/bookingId-------> Update booking (e.g., update seatsBooked)
router.patch("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  const { seatsBooked, status, bookingDate } = req.body;

  if (bookingDate && isNaN(Date.parse(bookingDate))) {
    return res.status(400).json({ message: "Invalid bookingDate format" });
  }

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
      
        // Update the booking with new seatsBooked and status if provided
        return Booking.findByIdAndUpdate(
          bookingId,
          {
            seatsBooked,
            ...(bookingDate && { bookingDate }),
            status: status !== undefined ? status : booking.status,
          },
          { new: true }
        );
      });
    })
    .then((updatedBooking) => {
      res.status(200).json({message: "Booking updated successfully",booking: updatedBooking,});
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
});

// DELETE/bookingId---------->Cancel booking
router.delete("/bookings/:bookingId", (req, res) => {
  const { bookingId } = req.params;
  console.log("bookingid------------", bookingId);
  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return res.status(400).json({ message: "Invalid booking ID format" });
  }

  Booking.findByIdAndDelete(bookingId)
    .then((booking) => {
      console.log("......",booking._id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(200).json({ message: `Booking with ${bookingId} deleted successfully` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    });
});

module.exports = router;
