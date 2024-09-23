const express = require("express");
const {
  register,
  login,
  getAllentrepreneurs,
  getAllInvestors,
  getAppointments,
  deleteAppointmentById,
  createUser,
  deleteEIById,
  getWebinarBooking,
  deleteWebinarBookingById,
  getFAQs,
  DeleteCourseById,
  deleteWebinarById,
  deleteConsultById,
  deleteBlogById,
  getBlogById,
} = require("../adminControllers/userController");

const { createFAQs } = require("../adminControllers/videoController");

const jwtTokenMiddleware = require("../adminMiddleware/jwtTokenMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/eiuser", jwtTokenMiddleware, createUser);
router.post("/faqs", jwtTokenMiddleware, createFAQs);

router.get("/getentrepreneurs", jwtTokenMiddleware, getAllentrepreneurs);
router.get("/getInvestors", jwtTokenMiddleware, getAllInvestors);
router.get("/getAppointments", jwtTokenMiddleware, getAppointments);
router.get("/getWebinarBooking", jwtTokenMiddleware, getWebinarBooking);
router.get("/blog", getFAQs);
router.get("/blog/:id", getBlogById);

router.delete("/deleteEI/:id", jwtTokenMiddleware, deleteEIById);
router.delete(
  "/deleteAppointment/:id",
  jwtTokenMiddleware,
  deleteAppointmentById
);
router.delete(
  "/deleteWebinarBooking/:id",
  jwtTokenMiddleware,
  deleteWebinarBookingById
);

router.delete("/deleteCourse/:id", jwtTokenMiddleware, DeleteCourseById);
router.delete("/delete-webinar/:id", jwtTokenMiddleware, deleteWebinarById);
router.delete("/delete-consult/:id", jwtTokenMiddleware, deleteConsultById);
router.delete("/delete-blog/:id", jwtTokenMiddleware, deleteBlogById);

module.exports = router;
