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
const fetchGeminiTextResponse = async (input) => {
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL,
    });

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    // Get main response
    const result = await chatSession.sendMessage(
        `Provide a clear response to the following input, ensuring you include exactly one helpful https link relevant to the topic. 
         Response should be useful and, wherever possible, should contain a directly related https link: "${input}"`
    );

    const responseText = result.response.text();

    // Extract HTTPS link if present
    const linkMatch = responseText.match(/https:\/\/[^\s\)\}\]]+/);
    const link = linkMatch ? linkMatch[0] : null;

    // First attempt to get follow-up questions with strict JSON formatting
    const getFollowUpQuestions = async () => {
        const response = await chatSession.sendMessage(
            `Based on the previous response about "${input}", generate exactly three follow-up questions.
             Your response must be in valid JSON array format.
             Format your response EXACTLY like this, with no additional text:
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
            // Try to extract anything that looks like a JSON array
            const jsonMatch = questionsText.match(/\[[\s\S]*\]/);
            
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (Array.isArray(parsed) && parsed.length === 3 && 
                    parsed.every(q => typeof q === 'string' && q.trim().length > 0)) {
                    followUpQuestions = parsed;
                    break;
                }
            }
        } catch (error) {
            console.error(`Attempt ${attempts + 1} failed:`, error);
        }
        attempts++;

        // If we failed, try again with an even stricter prompt
        if (attempts < maxAttempts) {
            await chatSession.sendMessage(
                `Please provide exactly three follow-up questions in strict JSON array format. 
                 Response must be ONLY a JSON array with three strings. 
                 No other text. No explanations. No formatting.`
            );
        }
    }

    // If we still don't have valid questions, make one final attempt with an extremely strict prompt
    if (!followUpQuestions) {
        try {
            const finalAttempt = await chatSession.sendMessage(
                `Return ONLY three questions in this exact format, replacing the example questions:
                 ["Question one?","Question two?","Question three?"]`
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