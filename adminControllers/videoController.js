const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Video = require("../adminModels/Video");
const Courses = require("../adminModels/courses");
const FAQs = require("../adminModels/faqs");

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Initialize Multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

// Check file type
function checkFileType(file, cb) {
  const filetypes = /mp4|mov|avi|mkv|jpeg|jpg|png/; // Support video & image formats
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Only videos and images are allowed!");
  }
}

exports.createFAQs = async (req, res) => {
  try {
    // Use multer to handle image upload
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message }); // Handle multer error
      }

      if (!req.files) {
        return res.status(400).json({ msg: "No video file selected" });
      }
      // Extract question and answer from the request body
      const { question, answer } = req.body;

      // Check if an image file was uploaded
      let imageUrl = "";
      if (req.files) {
        imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
          req.files.thumbnail[0].filename
        }`;
      }

      // Create new FAQ document with the image URL
      const newFAQs = new FAQs({
        question,
        answer,
        image: imageUrl, // Store the image URL
      });

      // Save the new FAQ in the database
      await newFAQs.save();

      // Respond with success message and data
      res.status(201).json({
        newFAQs,
        message: "FAQs created successfully with image",
        status: 201,
      });
    });
  } catch (error) {
    // Handle any errors during the process
    res.status(500).json({ error: error.message });
  }
};

// Create Courses API
exports.createCourses = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    // Check if files exist
    if (!req.files || !req.files["video"]) {
      return res.status(400).json({ msg: "No video file selected" });
    }

    // Extract the form data
    const { title, description, cost } = req.body;

    try {
      // Get video and thumbnail URLs
      console.log(req.files);

      const videoUrl = `/uploads/${req.files["video"][0].filename}`;
      const thumnailUrl = req.files["thumbnail"]
        ? `/uploads/${req.files["thumbnail"][0].filename}`
        : null; // Thumbnail optional

      // Create a new course
      const newCourse = new Courses({
        videoUrl,
        thumnailUrl,
        title,
        description,
        cost,
      });

      // Save the course to the database
      await newCourse.save();

      // Respond with the newly created course data
      res.status(201).json({
        msg: "Course created successfully",
        course: newCourse,
      });
    } catch (error) {
      res.status(500).json({ msg: "Error saving course", error });
    }
  });
};

// Get all courses
exports.getCourses = async (req, res) => {
  try {
    // Fetch all courses from the database
    const courses = await Courses.find();

    // Check if courses exist
    if (!courses || courses.length === 0) {
      return res.status(404).json({ msg: "No courses found" });
    }

    // Respond with the courses
    res.status(200).json({
      msg: "Courses retrieved successfully",
      courses,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ msg: "Error retrieving courses", error });
  }
};

// Handle video uploadconst path = require('path');

exports.uploadVideo = (req, res) => {
  upload(req, res, (err) => {
    // Handle Multer errors
    if (err) {
      return res.status(400).json({ msg: err.message || "File upload error" });
    }

    // Check if video file is uploaded
    if (!req.files || !req.files["video"] || req.files["video"].length === 0) {
      return res.status(400).json({ msg: "No video file selected" });
    }

    const videoFile = req.files["video"][0]; // Access the uploaded video file
    const { title, description, cost, date } = req.body; // Extract form data

    // Get the original filename and extension
    const originalName = path.parse(videoFile.originalname).name;
    const extension = path.extname(videoFile.originalname);

    // Make the filename unique by appending the current timestamp
    const uniqueName = `${originalName}-${Date.now()}${extension}`;

    // Define old and new paths for renaming the uploaded file
    const oldPath = videoFile.path;
    const newPath = path.join(path.dirname(oldPath), uniqueName);

    // Rename the uploaded file to make the filename unique
    fs.rename(oldPath, newPath, (renameErr) => {
      if (renameErr) {
        return res.status(500).json({ msg: "Failed to rename video file" });
      }

      // Generate dynamic URL for the uploaded file
      const protocol = req.protocol; // http or https
      const host = req.get("host"); // domain and port (e.g., localhost:4000)
      const videoUrl = `${protocol}://${host}/uploads/${uniqueName}`; // Full URL for the video file

      // Create a new Video document in the database
      const newVideo = new Video({
        url: videoUrl,
        title: title || originalName, // Use provided title or fallback to original name
        description: description || "", // Optional description
        cost: cost || 0, // Optional cost, default to 0 if not provided
        date: date || new Date(), // Optional date, default to current date if not provided
      });

      // Save video details in the database
      newVideo
        .save()
        .then((video) =>
          res.status(201).json({ fileName: uniqueName, url: video.url })
        )
        .catch((err) =>
          res
            .status(500)
            .json({ msg: "Failed to save video URL in database", error: err })
        );
    });
  });
};

// Get list of videos

exports.getVideos = async (req, res) => {
  try {
    // Fetch video details from the database
    const videos = await Video.find(); // Assuming the Video model has fields like url, title, etc.

    if (!videos || videos.length === 0) {
      return res.status(404).json({ msg: "No videos found" });
    }

    // Map over the videos and send URLs along with other details
    const videoData = videos.map((video) => ({
      url: video.url,
      title: video.title,
      description: video.description || "", // Include description if present
      cost: video.cost,
      date: video.date, // Include date if present
    }));

    return res.json(videos);
  } catch (err) {
    console.error("Error fetching videos:", err);
    return res.status(500).json({ msg: "Failed to fetch videos", error: err });
  }
};

exports.getVideoById = async (req, res) => {
  const videoId = req.params.id;

  // Check if videoId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    return res.status(400).json({ msg: "Invalid video ID" });
  }

  try {
    // Find the video in the database by ID
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ msg: "Video not found" });
    }

    // Send the video details back to the client
    res.status(200).json({ video });
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ msg: "Server error" });
  }
};
