const express = require("express");
const router = express.Router();
const visionController = require("../controllers/visionController"); // Import controller

// Route to analyze an image using Google Cloud Vision
router.post("/analyze-image", visionController.analyzeImage);

module.exports = router;
