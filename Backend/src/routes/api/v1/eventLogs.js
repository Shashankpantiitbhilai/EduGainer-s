const express = require('express');
const router = express.Router();
const { fetchLogs } = require("../../../controllers/logController");

// Route to fetch logs for admin dashboard
router.get('/logs', fetchLogs);

module.exports = router;
