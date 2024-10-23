const express = require("express");
const router = express.Router();
const geminiController = require("../controllers/ai/chatbot");

// Route to handle requests to the Gemini API
router.post("/chatbot", geminiController.getGeminiResponse);

// Export the router
module.exports = router;
