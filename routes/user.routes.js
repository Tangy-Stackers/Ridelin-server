const express = require("express");
const router = express.Router();
const User = require("../models/User.model");

const { isAuthenticated } = require("../middleware/jwt.middleware.js");
const bcrypt = require("bcrypt");
const saltRounds = 10;

//GET/user-----> get user
router.get("/", isAuthenticated, (req, res, next) => {
  User.find({})
    .populate("user")
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error", error });
    });
});
// GET/userId------> get a specific user by ID
router.get("/:userId", isAuthenticated, (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    // .populate("userId")
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Server Error", error });
    });
});
// PATCH/userId-------> Update user info
router.patch("/:userId", isAuthenticated, (req, res) => {
  const { userId } = req.params;
  const { password, email, name, phone, image, about } = req.body;
  const updateFields = {};

  User.findById(userId).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }    
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (image) updateFields.image = image;
    if (about) updateFields.about = about;

    User.findByIdAndUpdate(userId, updateFields, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          res.status(404).json({ message: "User not found" });
          return;
        }else{
        res.status(200).json({message: "User updated successfully", updatedUser});
        return;
      }
      })
      .catch((error) => {
        res.status(500).json({ message: "Server error", error });
        return;
      });
  });
});

module.exports = router;
