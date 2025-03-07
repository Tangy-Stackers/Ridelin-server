// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const cors = require("cors");
const app = express();

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);


// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// user route
const userRoutes = require("./routes/user.routes")
app.use("/api/user",userRoutes);

const rideRoutes = require("./routes/ride.routes");
app.use("/api/ride", rideRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

app.use("/api", require("./routes/booking.routes"));
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
