const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Determine the upload directory

const uploadDir = process.env.NODE_ENV === 'development' ? path.join(__dirname, 'uploads') : '/tmp/uploads';
console.log(uploadDir)
// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup with disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files to the determined directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Use timestamp and original name
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
