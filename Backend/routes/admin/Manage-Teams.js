const express = require("express");

const upload = require("../../multer");
const router = express.Router();

const TeamController = require("../../controllers/admin/Team-Managment/TeamsController");


router.post('/addTeam-member/:adminId', upload.single('image'), TeamController.addEmployee);
router.get('/getTeam-accounts', TeamController.fetchTeamAccounts);
router.patch('/editTeam-account/:id', TeamController.fetchTeamAccounts);
router.delete('/deleteTeam-accout:/id', TeamController.fetchTeamAccounts);
module.exports = router;
