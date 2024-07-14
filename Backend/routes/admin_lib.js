const express = require("express");
const { Student, User } = require("../models/student");
const upload = require("../multer");
const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender");
const admin_library= require("../controllers/library/admin_library");

const legend=require("../controllers/library/color")

router.get("/getBookingData", admin_library.getBookingData)

router.patch("/updateColor", admin_library.updateBookingColor)
router.get("/getLegends", legend.getLegends)
router.post("/addLegend", legend.addLegend)
router.delete(`/deleteLegend/:id`, legend.deleteLegend)
module.exports = router;
