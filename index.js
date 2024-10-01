const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const https = require("https");
const fs = require("fs");

dotenv.config();

const admin = require("./adminRoutes/userRoutes");
const consult = require("./adminRoutes/consultRoutes");
const middleware = require("./adminMiddleware/jwtTokenMiddleware");
const video = require("./adminRoutes/videoRoutes");

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "build")));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/admin", admin);
app.use("/api/videos", video);
app.use("/api/consult", consult);
app.use(middleware);

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

const privateKey = fs.readFileSync("/home/ubuntu/privkey.pem", "utf8");
const certificate = fs.readFileSync("/home/ubuntu/cert.pem", "utf8");
const ca = fs.readFileSync(
  "/etc/letsencrypt/live/brandneers.com/chain.pem",
  "utf8"
);

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const httpsServer = https.createServer(credentials, app);

const httpApp = express();
httpApp.use((req, res) => {
  res.redirect(`https://${req.headers.host}${req.url}`);
});
const httpServer = http.createServer(httpApp);

const HTTP_PORT = 3000;
const HTTPS_PORT = process.env.PORT || 4000;

httpsServer.listen(HTTPS_PORT, () => {
  console.log(`HTTPS Server is running on port ${HTTPS_PORT}`);
});

httpServer.listen(HTTP_PORT, () => {
  console.log(
    `HTTP Server is running on port ${HTTP_PORT} and redirecting to HTTPS`
  );
});
