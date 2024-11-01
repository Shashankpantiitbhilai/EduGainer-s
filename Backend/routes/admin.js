const express = require("express");
const { Student, User } = require("../models/student");
const upload = require("../multer");
const router = express.Router();

const { sendEmailWithAttachment } = require("../emailSender");
const adminController = require("../controllers/adminController");

router.get('/fetchLibData', adminController.fetchAllUsers);
router.get('/fetchAllSiteUsers', adminController.fetchAllSiteUsers);
router.post('/fetchLibResource', adminController.fetchLibResources);

router.delete('/deleteLibStudent/:id', adminController.deleteLibStudentById);

router.patch('/editLibStudent/:id', adminController.editLibStudentById);
router.post('/addStudentData', adminController.addLibStudent);
router.post('/uploadResource', upload.single('file'), adminController.uploadResource);
router.patch('/editUser/:id', adminController.editUserById);
router.patch('/editLibResource/:id', adminController.editLibResource);

router.delete('/deleteLibResource/:id', adminController.deleteLibResource);
router.get('/fetchAllUsers', adminController.fetchAllUsers);
router.get(`/fetchAllChats/:id`, adminController.fetchAllChats);
router.post('/addUser', adminController.addUser);

// Route to delete a user by ID
router.delete('/deleteUser/:id', adminController.deleteUser);
module.exports = router;
