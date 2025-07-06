const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    messages: [
        {
            sender: String,
            receiver: String,
            content: String,
            seen: { type: Boolean, default: false } // Default to false
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,  // Assuming user is an ObjectId
        ref: 'User'  // Reference to the User model
    },
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = {
    Message
};
