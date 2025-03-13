const mongoose = require("mongoose");
const { Schema, model } = mongoose;
// TODO: Please make sure you edit the User model to whatever makes sense in this case

const userSchema = new Schema(

  
  {
    email: {
      type: String,
      required: [true, "Email is required."],
       unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    phone :{
      type: String,
      required:[false, "Phone Number is required."],
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"],
    },
    image:{
      type:String,
      default: "https://static.vecteezy.com/system/resources/thumbnails/048/926/084/small/silver-membership-icon-default-avatar-profile-icon-membership-icon-social-media-user-image-illustration-vector.jpg",
    },
    about:{
      type: String,  
      trim: true,
      maxlength: 500,
    }
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

module.exports =mongoose.model("User", userSchema);
