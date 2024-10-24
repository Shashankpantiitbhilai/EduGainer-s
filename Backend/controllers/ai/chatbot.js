const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');
const fs = require('fs').promises;

// Initialize the Google Generative AI with your API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Common generation config
const generationConfig = {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 512,
    responseMimeType: 'text/plain',
};

// Controller function to handle text-based Gemini API requests
const getGeminiResponse = async (req, res) => {
    try {
        const { input } = req.body;
        console.log('Processing text input:', input);

        const response = await fetchGeminiTextResponse(input);
        res.json({ response });
    } catch (error) {
        console.error('Error in text processing:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

// Controller function to handle file upload and processing
const processFileWithGemini = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'No prompt provided' });
        }

        console.log('Processing file:', req.file.originalname);

        const response = await processFileAndGenerateResponse(req.file, prompt);
        res.json({ response });
    } catch (error) {
        console.error('Error in file processing:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    } finally {
        // Clean up: remove uploaded file if it exists
        if (req.file && req.file.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (error) {
                console.error('Error cleaning up file:', error);
            }
        }
    }
};

// Function to fetch text-based response from Gemini
const fetchGeminiTextResponse = async (input) => {
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL,
    });

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(input);
    return result.response.text();
};

// Function to process file and generate response
const processFileAndGenerateResponse = async (file, prompt) => {
    try {
        // Get file extension and determine MIME type
        const ext = path.extname(file.originalname).toLowerCase();
        const mimeType = getMimeType(ext);

        // Upload file to Gemini
        const uploadResponse = await fileManager.uploadFile(file.path, {
            mimeType: mimeType,
            displayName: file.originalname,
        });

        console.log(
            `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
        );

        // Generate content using the uploaded file
        const model = genAI.getGenerativeModel({
            model: process.env.AI_MODEL,
        });

        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: prompt },
        ]);

        return result.response.text();
    } catch (error) {
        console.error('Error in file processing:', error);
        throw error;
    }
};

// Helper function to determine MIME type
const getMimeType = (extension) => {
    const mimeTypes = {
        '.pdf': 'application/pdf',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        // Add more mime types as needed
    };

    return mimeTypes[extension] || 'application/octet-stream';
};

module.exports = {
    getGeminiResponse,
    processFileWithGemini,
};