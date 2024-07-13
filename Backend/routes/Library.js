const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");

router.get("/getSeatStatus", libraryController.getCurrentMonthBookings)
module.exports = router;