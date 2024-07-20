const express = require("express");
const router = express.Router();
const libraryController = require("../controllers/libraryController");
router.get("/getStudentLibSeat/:id", libraryController.getStudentLibSeat)
router.get("/getSeatStatus", libraryController.getCurrentMonthBookings)
router.get("/eligibleForRegistration/:user_id", libraryController.eligibleForRegistration)
// router.post("/fee-pay", libraryController.feePayment)
router.get(`/fetchStudent/:reg`, libraryController.getLibStudentData)
router.post('/verify-payment/:user_id', libraryController.verifyLibfeePayment);
router.post('/sendFeeData', libraryController.sendFeeData);
module.exports = router;