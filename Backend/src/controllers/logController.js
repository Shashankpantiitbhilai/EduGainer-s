// controllers/logController.js
const {Log} = require("../models/EventLogs");

/**
 * Fetch logs for the admin dashboard
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const fetchLogs = async (req, res) => {
    try {
        
        // Check if user is authenticated and is an admin
        if (!req.isAuthenticated() ) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Fetch logs, sorted by most recent first
        const logs = await Log.find()
            .sort({ timestamp: -1 })
            .limit(100); // Limit to most recent 100 logs
      
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs', error: error.message });
    }
};

module.exports = {
    fetchLogs
};
