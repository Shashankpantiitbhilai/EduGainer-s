const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google Generative AI with your API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
console.log(apiKey)
// Controller function to handle Gemini API requests
const getGeminiResponse = async (req, res) => {
    try {
        const { input } = req.body;
        console.log(input, "input");
        // Call the function to get the Gemini response
        const response = await fetchGeminiResponse(input);

        // Send the response back to the client
        res.json({ response });
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Function to fetch response from the Gemini API
const fetchGeminiResponse = async (input) => {
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL,
    });

    const generationConfig = {
        temperature: 0.7, // Lowering temperature for more deterministic answers
        topP: 0.9,        // Maintaining diversity while focusing on high-probability responses
        topK: 40,         // Focusing on a smaller number of top candidates for more relevant answers
        maxOutputTokens: 512, // Reducing output length for concise answers
        responseMimeType: 'text/plain', // Keeping the response type as plain text
    };

    const chatSession = model.startChat({
        generationConfig,
        history: [],
    });

    const result = await chatSession.sendMessage(input);

    return result.response.text(); // Adjust based on the structure of the response
};

// Export the controller functions
module.exports = {
    getGeminiResponse,
};
