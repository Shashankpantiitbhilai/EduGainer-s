const express = require("express");
const { Student, User } = require("../models/student");

const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender")
const adminController = require("../controllers/adminController")

router.get('/fetchLibData', adminController.searchStudentsByShift);
{
    console.log("reached server")
}



module.exports = router;
