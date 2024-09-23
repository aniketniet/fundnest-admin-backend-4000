const express = require("express");
const consultController = require("../adminControllers/consultController");
const jwtTokenMiddleware = require("../adminMiddleware/jwtTokenMiddleware");

const router = express.Router();

router.post("/createConsult", consultController.createConsult);

router.get("/getConsultall", consultController.getConsultAll);

router.get("/getConsult/:id", consultController.getConsultById);

module.exports = router;
