// routes/trafficRoutes.js
const express = require('express');
const router = express.Router();
const { getTrafficData } = require('../controllers/trafficController');

// Define the route for fetching traffic data
router.get('/traffic-data', getTrafficData);

module.exports = router;