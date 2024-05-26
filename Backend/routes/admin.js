const express = require("express");
const { Student, User } = require("../models/student");
const upload = require("../multer")
const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender")
const adminController = require("../controllers/adminController")

router.get('/fetchLibData', adminController.searchStudentsByShift);
{
    console.log("reached server")
}

router.get('/fetchLibResource', adminController.fetchLibResources);
{
    console.log("reached server to fetch lib resources")
}

router.delete(`/deleteLibStudent/:id`, adminController.deleteStudentById);
{
    console.log("delete")
}

router.patch(`/editLibStudent/:id`, adminController.editStudentById);
{
    console.log("patch")
}


router.post('/uploadResource', upload.single('file'), adminController.uploadResource)
router.patch(`/editLibResource/:id`, adminController.editLibResource);
{
    console.log("patch edit lib resources")
}
router.delete(`/deleteLibResource/:id`, adminController.deleteLibResource);
{
    console.log("patch delete lib resources")
}
module.exports = router;
