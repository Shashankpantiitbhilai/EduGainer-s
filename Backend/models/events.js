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
    event: {
        type: Boolean,
        default: false,
    }, imageUrl: {
        type: String,
       
    },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
