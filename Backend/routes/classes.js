const express = require("express");
const router = express.Router();
const admin = require("../controllers/classes/admin_classes");
const classController = require("../controllers/classesController");
// Route to add a new class

router.post("/create-order", classController.order);
// Route to get all classes
router.get("/getStudentDetails/:id", classController.getClassStudentById);
router.post("/payment-verification/:user_id", classController.paymentVerification);
router.get("/getAllClasses", admin.getClasses);
router.post("/eligibility/:classId", classController.checkEligibility);
router.get("/getStudentDetails/:id/:classId", classController.getStudentDetails);
// Route to get a single class by ID
// router.get("/getClass/:id", classController.getClassById);

// Export the router
module.exports = router;
