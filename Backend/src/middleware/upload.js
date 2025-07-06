const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Determine the upload directory
const uploadDir = process.env.NODE_ENV == 'development' ? path.join(__dirname, '../uploads') : '/tmp/uploads';

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

// Memory storage for CSV files (no need to save to disk)
const memoryStorage = multer.memoryStorage();

const upload = multer({ storage: storage });

// CSV upload configuration
const csvUpload = multer({
    storage: memoryStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.toLowerCase().endsWith('.csv')) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV files are allowed'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = {
    upload,
    csvUpload
};
