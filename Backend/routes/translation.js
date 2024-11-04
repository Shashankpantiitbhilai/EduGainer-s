const express = require('express');
const { translateText } = require('../controllers/translationController');

const router = express.Router();

// POST route to handle translation requests
router.post('/website-content', translateText);

module.exports = router;
