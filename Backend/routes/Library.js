const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

router.get("/getSeatStatus", libraryController.getCurrentMonthBookings)
router.get("/eligibleForRegistration/:user_id", libraryController.eligibleForRegistration)
module.exports = router;