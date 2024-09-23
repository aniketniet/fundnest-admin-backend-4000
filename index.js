const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// Importing routers and middleware
const admin = require("./adminRoutes/userRoutes");
const consult = require("./adminRoutes/consultRoutes");
const middleware = require("./adminMiddleware/jwtTokenMiddleware");
const video = require("./adminRoutes/videoRoutes");

// Initialize express app
const app = express();

// Use CORS middleware
app.use(cors());

// Use bodyParser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder for React
app.use(express.static(path.join(__dirname, "build")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Define parent routers
app.use("/admin", admin);
app.use("/videos", video);
app.use("/consult", consult);
app.use(middleware);

// MongoDB connection
const dbURI =
  process.env.DBURI ||
  "mongodb+srv://Fundnest:8877446687@fundnest.lris2bh.mongodb.net/";

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB Server");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
