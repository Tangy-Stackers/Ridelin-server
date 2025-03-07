const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Ride = require("../models/Ride.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

//  POST /api/ride  -  Creates a new ride
router.post("/", (req, res, next) => {
  const { origin, destination, seatsAvailable, price, driverId } = req.body;

  Ride.create({  origin, destination, seatsAvailable, price, driverId })

    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the ride", err);
      res.status(500).json({ message: "Error while creating the ride" });
    });
});

// POST /api/ride - check rides
router.get("/",isAuthenticated,(req,res,next)=>{
    Ride.find()
        .then((rides)=>{res.json(rides)})
        .catch((err) =>{
            console.log("Error while fetching rides",err);
            res.status(500).json({ message: "Error while fetching rides"})
        });
});


// POST /api/ride - check rides by ID
router.get("/:rideId",isAuthenticated,(req,res,next)=>{
    const { rideId } = req.params;
    Ride.findById(rideId)
        .then((rides)=>{
            if(rides === null){res.status(404).json({ message: "Ride not Found" })}
            else{res.json(rides)}
        }) 
        .catch((err) =>{
            console.log("Error while fetching rides",err);
            res.status(500).json({ message: "Error while fetching rides"})
        });
});

// DELETE  /api/ride/:rideId  -  Deletes a specific ride by id
router.delete("/:rideId", isAuthenticated, (req, res, next) => {
    const { rideId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(rideId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
  
    Ride.findByIdAndDelete(rideId)
      .then(() =>
        res.json({
          message: `Ride with ${rideId} is removed successfully.`,
        })
      )
      .catch((err) => {
        console.log("Error while deleting the ride", err);
        res.status(500).json({ message: "Error while deleting the ride" });
      });
  });


module.exports = router;
