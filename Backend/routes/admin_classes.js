const express = require("express");
const router = express.Router();
const classController = require("../controllers/classes/admin_classes");

// Route to add a new class
router.post("/addClass", classController.addClass);

// Route to edit an existing class by ID
router.patch("/editClass/:id", classController.editClass);

// Route to deletgetBatchData/${batchId}e a class by ID
router.delete("/deleteClass/:id", classController.deleteClass);

// Route to get all classes
router.get("/getAllClasses", classController.getClasses);
router.get("/getBatchData/:batchId", classController.getBatchStudents);
// Route to get a single class by ID
// router.get("/getClass/:id", classController.getClassById);

// Export the router
module.exports = router;
