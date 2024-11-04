const speechServices = require('./audioHandler'); // Adjust path as needed
const multer = require('multer');

// Corrected handler function syntax
const handler = async function (req, res) {
    try {
        // Check if file exists in request
        if (!req.file) {
            throw new Error('No audio file received');
        }

        // Get audio buffer from the uploaded file
        const audioBuffer = req.file.buffer;

        // Convert audio buffer to base64
        const audioContent = audioBuffer.toString('base64');

        // Convert speech to text using the imported function
        const transcription = await speechServices.convertSpeechToText(audioContent);

        // Send back the transcribed text
        res.json({
            success: true,
            text: transcription
        });

    } catch (error) {
        console.error('Error processing audio:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to process audio'
        });
    }
};

module.exports = {
    handler,
};
