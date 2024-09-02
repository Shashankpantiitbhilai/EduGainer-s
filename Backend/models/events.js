const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    googleFormLink: {
        type: String,
    },
    image: {
        publicId: { type: String },
        url: { type: String },
    },
    
    endDate: {
        type: Date,
        required: true, // Optional: set to true if the end date is required
    },
});


const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
