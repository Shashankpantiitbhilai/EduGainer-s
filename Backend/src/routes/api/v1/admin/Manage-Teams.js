const express = require("express");

const { upload } = require("../../../../middleware/upload");
const router = express.Router();

const TeamController = require("../../../../controllers/admin/Team-Managment/TeamsController");


router.post('/addTeam-member/:adminId', upload.single('image'), TeamController.addEmployee);
router.get('/getTeam-accounts', TeamController.fetchTeamAccounts);
router.patch('/editTeam-account/:id', TeamController.fetchTeamAccounts);
router.delete('/deleteTeam-account/:id', TeamController.deleteUser);
router.post('/verifyRoleForLibrary', TeamController.verifyRoleForLibrary);
module.exports = router;
