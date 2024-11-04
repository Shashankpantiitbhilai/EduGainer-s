const express = require("express");
const router = express.Router();
const multer = require("multer");
const geminiController = require("../controllers/ai/chatbot");
const audioController = require("../controllers/ai/audioController");
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Ensure this directory exists
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
});

// File filter to restrict file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

const upload1 = multer({ storage: multer.memoryStorage() });
// Route for text-based chat
router.post("/chatbot", geminiController.getGeminiResponse);
router.post("/chatbot/processAudio", upload1.single('audio'), audioController.handler);
// Route for file upload and processing
router.post("/chatbot/file",
    upload.single('file'), // 'file' is the field name in form-data
    geminiController.processFileWithGemini
);

// Error handling middleware for file upload errors
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File size is too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            error: 'File upload error: ' + error.message
        });
    } else if (error) {
        return res.status(400).json({
            error: error.message
        });
    }
    next();
});

module.exports = router;