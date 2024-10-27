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

const getGeminiResponse = async (req, res) => {
    try {
        const { input } = req.body;
        // console.log('Processing text input:', input);

        const { responseText, followUpQuestions } = await fetchGeminiTextResponse(input);

        // Send back both response and suggested follow-up questions
        res.json({ response: responseText, followUpQuestions });
    } catch (error) {
        console.error('Error in text processing:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

// Function to fetch text-based response from Gemini and suggest follow-up questions
const fetchGeminiTextResponse = async (input) => {
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL,
    });

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    // Send user input to the model
    const result = await chatSession.sendMessage(input);

    // Extract response text
    const responseText = result.response.text();

    // Request suggested follow-up questions based on the response
    const suggestedQuestions = await chatSession.sendMessage(
        `Based on the provided answer, please suggest exactly three relevant follow-up questions. Ensure that the output is formatted as an array with three elements. The format should be: ["Question 1", "Question 2", "Question 3"].`
    );

    // Log the raw response text
    const suggestedQuestionsText = suggestedQuestions.response.text();
  

    let followUpQuestions;
    try {
        // Directly parse the suggestedQuestionsText without modification
        followUpQuestions = JSON.parse(suggestedQuestionsText);
    } catch (error) {
        console.error("Failed to parse follow-up questions:", error);
        throw new Error("Failed to parse follow-up questions from the response.");
    }

    // Ensure the followUpQuestions array has exactly three elements
    if (followUpQuestions.length !== 3) {
        throw new Error("The follow-up questions array must contain exactly three elements.");
    }

    return { responseText, followUpQuestions };
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