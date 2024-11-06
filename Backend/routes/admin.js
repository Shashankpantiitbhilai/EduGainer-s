const express = require("express");

const upload = require("../multer");
const router = express.Router();

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


module.exports = router;
