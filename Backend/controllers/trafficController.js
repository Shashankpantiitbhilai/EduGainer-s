// controllers/trafficController.js
const TrafficData = require('../models/traffic');

exports.getTrafficData = async (req, res) => {
    try {
        const data = await TrafficData.find().sort({ date: -1 }); // Sort by date in descending order
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching traffic data:', error);
        res.status(500).json({ message: 'Failed to fetch traffic data' });
    }
};
