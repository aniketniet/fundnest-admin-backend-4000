const jwt = require("jsonwebtoken");
const AdminUser = require("../adminModels/Adminuser");
const dotenv = require("dotenv");
const User = require("../adminModels/user");
const Consult = require("../adminModels/consult");
const multer = require("multer");
const path = require("path");
const Service = require("../adminModels/Service");

dotenv.config();

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
  },
});
const upload = multer({ storage: storage });

// Create consult
exports.createConsult = (req, res) => {
  // Image upload
  upload.single("image")(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: err.message });
    }

    const {
      name,
      email,
      skills,
      experience,
      price,
      education,
      company,
      discription,
    } = req.body;

    console.log(req.body);

    // Get image URL if image was uploaded
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // Create a new consult entry
    try {
      const newConsult = new Consult({
        name,
        email,
        skills,
        experience,
        price,
        image: imageUrl, // Save the image URL in the database
        education,
        company,
        discription,
      });

      // Save the consult in the database
      await newConsult.save();

      res.status(201).json({
        message: "Consult created successfully",
        consult: newConsult,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating consult",
        error: error.message,
      });
    }
  });
};

// Get all consults
exports.getConsultAll = async (req, res) => {
  try {
    // Fetch all consult records from the database
    const consults = await Consult.find();

    // Return the consult data in the response
    res.status(200).json({
      message: "All consults fetched successfully",
      consults: consults, // Return the list of consults
    });
  } catch (error) {
    console.error("Error fetching consults:", error);
    res.status(500).json({
      message: "Error fetching consults",
      error: error.message,
    });
  }
};

// Get consult by ID
exports.getConsultById = async (req, res) => {
  const consultId = req.params.id; // Get the ID from the request parameters
  console.log("consultId", consultId);

  try {
    // Find the consult record by ID
    const consult = await Consult.findById(consultId);

    if (!consult) {
      return res.status(404).json({
        message: "Consult not found",
      });
    }

    // Return the consult data in the response
    res.status(200).json({
      message: "Consult fetched successfully",
      consult: consult,
    });
  } catch (error) {
    console.error("Error fetching consult:", error);
    res.status(500).json({
      message: "Error fetching consult",
      error: error.message,
    });
  }
};

// Create service
exports.setService = (req, res) => {
  // Image upload
  upload.single("image")(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "Image upload failed", error: err.message });
    }

    const { tittle, subtitle, discription, price } = req.body;

    console.log(req.body);

    // Get image URL if image was uploaded
    let imageUrl = "";
    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // Validate required fields
    if (!tittle || !discription || !price || !imageUrl) {
      return res.status(400).json({
        message: "Tittle, description, price, and image are required",
      });
    }

    // Create a new service entry
    try {
      const newService = new Service({
        image: imageUrl,
        tittle,
        subtitle, // Optional field
        discription,
        price,
      });

      // Save the service in the database
      await newService.save();

      res.status(201).json({
        message: "Service created successfully",
        service: newService,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error creating service",
        error: error.message,
      });
    }
  });
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json({
      message: "All services fetched successfully",
      services: services,
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({
      message: "Error fetching services",
      error: error.message,
    });
  }
};
