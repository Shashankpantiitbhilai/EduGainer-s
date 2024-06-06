const express = require("express");
const router = express.Router();
const classController = require("../controllers/classesController");

router.post("/new-reg", classController.createClassRegistration);
router.get("/:user_id", classController.getUserById);
router.post('/payment-verification/:user_id', classController.verifyPayment);

// Add other routes as needed

module.exports = router;
