const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    operationType: {
        type: String,
        enum: ['insert', 'update', 'delete', 'replace', 'system'],
        default: 'system'
    },
    additionalData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    modelName: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Log', LogSchema);