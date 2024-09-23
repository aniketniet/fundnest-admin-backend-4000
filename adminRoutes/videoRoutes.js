const express = require("express");
const router = express.Router();
const videoController = require("../adminControllers/videoController");
const jwtTokenMiddleware = require("../adminMiddleware/jwtTokenMiddleware");

// Route to handle video upload
router.post("/upload", jwtTokenMiddleware, videoController.uploadVideo);

router.get("/get-uploads", videoController.getVideos);

router.get("/videos/:id", videoController.getVideoById); // Expecting a valid video ID here

router.post("/create-courses", videoController.createCourses);
router.get("/get-courses", videoController.getCourses);

module.exports = router;
