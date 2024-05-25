const mongoose = require('mongoose');
const { array } = require('../multer');

const resourceSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: [], // Optional: default to an empty array if no tags are provided
    },
});

const Resource = mongoose.model("Resource", resourceSchema);
module.exports = {

    Resource
}