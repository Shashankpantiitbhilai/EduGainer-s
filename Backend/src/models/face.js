const mongoose = require('mongoose');
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

// Face Schema
const faceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Face detection data
    landmarks: [{
        type: {
            type: String,  // e.g., 'LEFT_EYE', 'RIGHT_EYE', 'NOSE_TIP'
            position: {
                x: Number,
                y: Number,
                z: Number
            }
        }
    }],

    faceAngles: {
        rollAngle: Number,    // Z-axis rotation
        panAngle: Number,     // Y-axis rotation
        tiltAngle: Number     // X-axis rotation
    },

    boundingBox: {
        left: Number,
        top: Number,
        width: Number,
        height: Number
    },

    confidence: Number,     // Detection confidence score

    // Reference image data
    referenceImage: {
        url: String,           // URL of the image
        publicId: String,      // Cloudinary public ID
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    },
    // Authentication history
    authHistory: [{
        timestamp: Date,
        success: Boolean,
        confidence: Number
    }],

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});





const Face = mongoose.model('Face', faceSchema);

module.exports = { Face };