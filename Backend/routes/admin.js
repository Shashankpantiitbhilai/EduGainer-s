const express = require("express");
const { Student, User } = require("../models/student");

const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender")
const adminController = require("../controllers/adminController")

router.get('/fetchLibData', adminController.searchStudentsByShift);
{
    console.log("reached server")
}

router.delete(`/deleteLibStudent/:id`, adminController.deleteStudentById);
{
    console.log("delete")
}

router.patch(`/editLibStudent/:id`, adminController.editStudentById);
{
    console.log("patch")
}

module.exports = router;
