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
app.use("/api", require("./routes/index.routes"));

// user route
app.use("/api/user",require("./routes/user.routes"));
app.use("/api/ride", require("./routes/ride.routes"));
app.use("/auth", require("./routes/auth.routes"));
app.use("/api", require("./routes/booking.routes"));
// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
