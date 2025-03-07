const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");


//GET/user-----> get user
router.get("/",isAuthenticated, (req, res, next) => {
  User.find({})
    .populate("user")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error",error });
    });
});
// GET/userId------> get a specific user by ID
router.get("/:userId",isAuthenticated, (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    // .populate("userId")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error",error });
    });
});
// PATCH/userId-------> Update user info
router.patch("/:userId",isAuthenticated, (req, res) => {
  const { userId } = req.params;
  const { password } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      // Check the users collection if a user with the same email already exists
      const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        if (!passwordRegex.test(password)) {
            res.status(400).json({
            message:"Password must have at least 8 characters and contain at least one number, one lowercase and one uppercase letter.",
            });
            return;
        }
    // If password is unique, proceed to hash the password
          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(password, salt);
      return User.findByIdAndUpdate(
        userId,
        { password: hashedPassword},
        { new: true }
      );
      
    })
    .then((updatedBooking) => {
      res.status(200).json({
        message: "Booking updated successfully",
        booking: updatedBooking,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Server error",error });
    });
});


module.exports = router;
