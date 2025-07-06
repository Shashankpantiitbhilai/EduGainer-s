// models/TrafficData.js
const mongoose = require('mongoose');

const trafficDataSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    pageViews: { type: Number, required: true },
    uniqueVisitors: { type: Number, required: true },
});

const TrafficData = mongoose.model('TrafficData', trafficDataSchema);

module.exports = TrafficData;
