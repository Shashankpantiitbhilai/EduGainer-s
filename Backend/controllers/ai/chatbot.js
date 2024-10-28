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
    temperature: 0.3,  // Lower temperature for more deterministic responses
    topP: 0.95,        // Slightly higher topP for broader response diversity without sacrificing precision
    topK: 30,          // Lower topK to focus on high-probability words
    maxOutputTokens: 512,  // Increased token count to accommodate detailed answers
    responseMimeType: 'text/plain',  // Set for flexible output that can support text with markdown for image or link embedding
    // Enables multimodal input (text + references to images)
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

        // User personalization


        // Keyword extraction



        // Pass context to Gemini
        const { responseText, followUpQuestions, link } = await fetchGeminiTextResponse(input, {
            sessionHistory,


        });

        res.json({ response: responseText, followUpQuestions, link });
    } catch (error) {
        console.error('Error in text processing:', error);
        res.status(500).json({
            error: 'Internal Server Error',
            details: error.message
        });
    }
};

// Function to fetch text-based response from Gemini and suggest follow-up questions
// Function to fetch text-based response from Gemini and suggest follow-up questions
const fetchGeminiTextResponse = async (input, { sessionHistory }) => {
    // Transform session history into the format expected by Gemini
    const formattedHistory = sessionHistory.map(entry => ([
        // User message
        {
            role: "user",
            parts: [{ text: entry.user }]
        },
        // If there's a response, include it
        entry.assistant && {
            role: "model",
            parts: [{ text: entry.assistant }]
        }
    ]).filter(Boolean)); // Remove undefined entries

    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL,
    });

    const chatSession = model.startChat({
        generationConfig,
        history: formattedHistory.flat(), // Flatten the array of message pairs
    });

    // Get main response
    const result = await chatSession.sendMessage(
        `Respond to the user's input: "${input}"
        Please include exactly one helpful https link relevant to the topic in your response.`
    );

    const responseText = result.response.text();

    // Extract HTTPS link if present
    const linkMatch = responseText.match(/https:\/\/[^\s\)\}\]]+/);
    const link = linkMatch ? linkMatch[0] : null;

    // Function to get follow-up questions with strict JSON formatting
    const getFollowUpQuestions = async () => {
        const response = await chatSession.sendMessage(
            `Based on our conversation, generate exactly three follow-up questions.
            Your response must be in valid JSON array format.
            Format your response EXACTLY like this:
            ["First question here?", "Second question here?", "Third question here?"]`
        );

        return response.response.text().trim();
    };

    // Keep trying until we get valid JSON
    let followUpQuestions;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
        try {
            const questionsText = await getFollowUpQuestions();
            const jsonMatch = questionsText.match(/\[[\s\S]*\]/);

            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed) &&
                    parsed.length === 3 &&
                    parsed.every(q => typeof q === 'string' && q.trim().length > 0)) {
                    followUpQuestions = parsed;
                    break;
                }
            }
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed:`, error);
        }
        attempts++;

        // If we failed, try again with a stricter prompt
        if (attempts < maxAttempts) {
            await chatSession.sendMessage(
                `Please provide exactly three follow-up questions in strict JSON array format.
                Response must be ONLY a JSON array with three strings.
                No other text.`
            );
        }
    }

    // Final attempt with extremely strict prompt if needed
    if (!followUpQuestions) {
        try {
            const finalAttempt = await chatSession.sendMessage(
                `Return ONLY three questions in this exact format:
                ["Question one?", "Question two?", "Question three?"]`
            );
            const finalText = finalAttempt.response.text().trim();
            const jsonMatch = finalText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                followUpQuestions = JSON.parse(jsonMatch[0]);
            }
        } catch (error) {
            throw new Error("Unable to generate valid follow-up questions after all attempts");
        }
    }

    if (!Array.isArray(followUpQuestions) || followUpQuestions.length !== 3) {
        throw new Error("Failed to generate valid follow-up questions");
    }

    return { responseText, followUpQuestions, link };
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