const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const https = require("https");
const http = require("http");
const fs = require("fs");

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
// Optionally, you can configure the CORS settings:

// Use bodyParser middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder for React
app.use(express.static(path.join(__dirname, "build")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/ping", (req, res) => {
  res.send("pong");
});
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

// SSL Certificate and Key
const options = {
  key: fs.readFileSync("/etc/ssl/private/myserver.key"), // Update with your private key path
  cert: fs.readFileSync("/etc/ssl/certs/myserver.crt"), // Update with your certificate path
};

// Start HTTPS Server
const httpsPort = process.env.PORT || 4000; // Default HTTPS port
const httpsServer = https.createServer(options, app);

// Start HTTP Server to redirect to HTTPS
// const httpPort = process.env.HTTP_PORT || 80; // Default HTTP port
// const httpServer = http.createServer((req, res) => {
//   res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
//   res.end();
// });

// Start servers
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS Server is running on port ${httpsPort}`);
});

// httpServer.listen(httpPort, () => {
//   console.log(
//     `HTTP Server is running on port ${httpPort} and redirecting to HTTPS`
//   );
// });
