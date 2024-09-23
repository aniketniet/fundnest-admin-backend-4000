const express = require("express");
const router = express.Router();
const videoController = require("../adminControllers/videoController");
const jwtTokenMiddleware = require("../adminMiddleware/jwtTokenMiddleware");
const walletController = require("../adminControllers/walletController");

// Route to handle video upload
router.post("/update-wallet", jwtTokenMiddleware, walletController.uploadVideo);

module.exports = router;
