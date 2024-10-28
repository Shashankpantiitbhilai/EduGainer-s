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

        // Session-based history
        const sessionHistory = req.session.history || [];
        sessionHistory.push({ user: input });
        if (sessionHistory.length > 10) sessionHistory.shift();
        req.session.history = sessionHistory;

        const { responseText, followUpQuestions, link } = await fetchGeminiTextResponse(input, {
            sessionHistory,
        });

        res.json({ response: responseText, followUpQuestions, link });
    } catch (error) {
        console.error('Error in text processing:', error);
        // Send a more graceful response with default follow-up questions
        res.json({
            response: error.mainResponse || "I apologize, but I encountered an error processing your request.",
            followUpQuestions: [
                "Could you rephrase your question?",
                "Would you like to try a different approach?",
                "Should we explore a different topic?"
            ],
            link: null
        });
    }
};

const extractLink = (text) => {
    const linkMatch = text.match(/https:\/\/[^\s\)\}\]]+/);
    return linkMatch ? linkMatch[0] : null;
};

const fetchGeminiTextResponse = async (input, { sessionHistory }) => {
    // Transform session history into Gemini's format
    const formattedHistory = sessionHistory.map(entry => ([
        {
            role: "user",
            parts: [{ text: entry.user }]
        },
        entry.assistant && {
            role: "model",
            parts: [{ text: entry.assistant }]
        }
    ]).filter(Boolean));

    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL || "gemini-pro",
    });

    const chatSession = model.startChat({
        generationConfig,
        history: formattedHistory.flat(),
    });

    // Get main response first
    const result = await chatSession.sendMessage(
        `Respond to the user's input: "${input}"
        Please include exactly one helpful https link relevant to the topic in your response.`
    );

    const responseText = result.response.text();
    const link = extractLink(responseText);

    // Simplified follow-up questions generation with better error handling
    const getFollowUpQuestions = async () => {
        try {
            const response = await chatSession.sendMessage(`
                Based on the user's message: "${input}" and our conversation history,
                generate 3 NEW, DIFFERENT follow-up questions that:
                1. Are directly related to the specific topic discussed
                2. Encourage deeper exploration of different aspects
                3. Are NOT generic questions like "Can you elaborate?" or "Would you like to know more?"
                
                Format EXACTLY as JSON array: ["Question 1?", "Question 2?", "Question 3?"]
                IMPORTANT: Questions must be different from previous ones and specific to the topic.
            `);

            const text = response.response.text().trim();

            // Enhanced JSON extraction with stricter pattern matching
            const jsonPattern = /\[\s*"[^"]+\?"\s*,\s*"[^"]+\?"\s*,\s*"[^"]+\?"\s*\]/;
            const match = text.match(jsonPattern);

            if (match) {
                const questions = JSON.parse(match[0]);

                // Validate questions are unique and topic-specific
                const areQuestionsValid = questions.length === 3 &&
                    questions.every(q => q.endsWith('?')) &&
                    questions.every(q => q.length > 15) && // Ensure meaningful length
                    new Set(questions).size === 3; // Ensure all questions are unique

                if (areQuestionsValid) {
                    return questions;
                }
            }

            // If we get here, generate contextual fallback questions
            return generateContextualQuestions(input);
        } catch (error) {
            console.warn('Error generating follow-up questions:', error);
            return generateContextualQuestions(input);
        }
    };

    const generateContextualQuestions = (input) => {
        // Extract key terms from input
        const keywords = input.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(' ')
            .filter(word => word.length > 3)
            .slice(0, 2);

        // If we have meaningful keywords, use them
        if (keywords.length > 0) {
            const topic = keywords.join(' ');
            return [
                `What specific aspects of ${topic} would you like to learn more about?`,
                `How do you currently use or interact with ${topic}?`,
                `What challenges have you faced regarding ${topic}?`
            ];
        }

        // Rotate through different sets of fallback questions to avoid repetition
        const fallbackSets = [
            [
                "What specific aspects of this topic interest you most?",
                "How would you like to apply this information?",
                "What related areas should we explore next?"
            ],
            [
                "Could you share your experience with this subject?",
                "What practical applications are you looking for?",
                "Which parts would you like me to clarify further?"
            ],
            [
                "How does this relate to your current goals?",
                "What background knowledge do you have in this area?",
                "What practical examples would be most helpful?"
            ]
        ];

        // Use session history length to rotate through different sets
        const setIndex = (sessionHistory.length || 0) % fallbackSets.length;
        return fallbackSets[setIndex];
    };

    const followUpQuestions = await getFollowUpQuestions();

    return {
        responseText,
        followUpQuestions,
        link
    };
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