// color-legend.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define schema for color legend
const ColorLegendSchema = new Schema({
    name: {
        type: String,
       
        unique: true  // Ensure name is unique
    },
    colorCode: {
        type: String,
           }
});

// Create and export model based on schema
const ColorLegend = mongoose.model('ColorLegend', ColorLegendSchema);

module.exports = {
    ColorLegend
};
