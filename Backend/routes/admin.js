const express = require("express");
const { Student, User } = require("../models/student");
const upload = require("../multer");
const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender");
const adminController = require("../controllers/adminController");

router.get('/fetchLibData', adminController.searchStudentsByShift);

router.post('/fetchLibResource', adminController.fetchLibResources);

router.delete('/deleteLibStudent/:id', adminController.deleteStudentById);

router.patch('/editLibStudent/:id', adminController.editStudentById);

router.post('/uploadResource', upload.single('file'), adminController.uploadResource);

router.patch('/editLibResource/:id', adminController.editLibResource);

router.delete('/deleteLibResource/:id', adminController.deleteLibResource);

module.exports = router;
