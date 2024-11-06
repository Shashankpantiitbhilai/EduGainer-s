const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const path = require('path');
const fs = require('fs').promises;
const { TranslationServiceClient } = require('@google-cloud/translate');
const translationClient = new TranslationServiceClient();

// Initialize the Google Generative AI with your API key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
  // Typically 'global' is used unless specified otherwise.
const {translateText}=require("./googleApi/translate-api")
// Common generation config
const generationConfig = {
    temperature: 0.7,  // Lower temperature to reduce randomness
    topP: 0.8,         // Slightly lower topP to prioritize EduGainer context
    topK: 20,          // Lower topK to keep responses focused on EduGainer
    maxOutputTokens: 1024,
    responseMimeType: 'text/plain',
};


const getGeminiResponse = async (req, res) => {
    try {
        const { input } = req.body;
        const { language, soundMode } = req.params;

        // Adjust the language if necessary (only supporting English and Hindi for now)
        const promptLanguage = language;
        // Session-based history to maintain conversation context
        const sessionHistory = req.session.history || [];
        sessionHistory.push({ user: input });
        if (sessionHistory.length > 10) sessionHistory.shift();
        req.session.history = sessionHistory;

        // Fetch response strictly related to EduGainer
        const { responseText, followUpQuestions, link } = await fetchGeminiTextResponse(input, {
            sessionHistory, language: promptLanguage
        });
        const translatedResponse = await translateText([responseText], language);
        const translatedQuestions = await translateText(followUpQuestions, language);

        res.json({ response: translatedResponse[0], followUpQuestions: translatedQuestions, link });
     
    } catch (error) {
        console.error('Error in text processing:', error);

        // Error fallback with EduGainer-specific questions
        res.json({
            response: "I'm sorry, there was an issue processing your request. Please try asking about EduGainer's services, such as the library, classes, or stationery.",
            followUpQuestions: [
                "What can I help you with regarding EduGainer’s library services?",
                "Would you like information on EduGainer’s classes?",
                "Are you interested in EduGainer's stationery offerings?"
            ],
            link: null
        });
    }
};
const extractLink = (text) => {
    const linkMatch = text.match(/https:\/\/[^\s\)\}\]]+/);
    return linkMatch ? linkMatch[0] : null;
};


// Adjusted function to generate responses strictly related to EduGainer
const fetchGeminiTextResponse = async (input, { sessionHistory,language }) => {
    console.log(language,)
    // Step 1: Format session history for Gemini
    const formattedHistory = sessionHistory.map(entry => {
        if (entry.user) {
            return { role: "user", parts: [{ text: entry.user }] };
        }
        if (entry.assistant) {
            return { role: "model", parts: [{ text: entry.assistant }] };
        }
        return null;
    }).filter(Boolean);

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({
        model: process.env.AI_MODEL || "gemini-pro",
    });

    // Step 2: Classify user input as EduGainer-related (1) or not (0)
    const classificationAgent = model.startChat({
        generationConfig,
        history: formattedHistory,
    });

    const classificationResult = await classificationAgent.sendMessage(
        ` Context:
EduGainer's is an educational platform in Uttarkashi, Uttarakhand that provides:
1. Library services with extensive study materials
2. Coaching classes across various subjects
3. Stationery supplies for students
They operate both online and offline, focusing on quality educational support.

Task:
Classify the following questions as either:
1 = Related to EduGainer's services and offerings
0 = Not related to EduGainer's

Examples:
Q: "Do you have NCERT books for class 12th science?"
A: 1 (Related - asks about library resources)

Q: "What are your coaching timings for JEE preparation?"
A: 1 (Related - asks about coaching services)

Q: "Where can I buy graph papers and geometry box?"
A: 1 (Related - asks about stationery)

Q: "What's the best restaurant in Uttarkashi?"
A: 0 (Not related - about restaurants)

Q: "How to prepare dal makhani?"
A: 0 (Not related - about cooking)

Please classify the following question as 1 (Related) or 0 (Not Related):
 \`${input}\`.
    
        `
    );
    const chatSession = model.startChat({
        generationConfig,
        history: formattedHistory,
    });

    const classificationResponse = (await classificationResult.response.text()).trim();
    console.log(classificationResponse, "response-class")
    // Step 3: Proceed based on classification
    if (classificationResponse.includes("1")){
        // If related to EduGainer, start chat session for generating a helpful response

        const result = await chatSession.sendMessage(
            `You are Aiden, an assistant working for EduGainer's to help users with inquiries about EduGainer's classes, library, and related services. 
            EduGainer's is well-known for providing the best library services, coaching classes, and a wide range of stationery items in Uttarkashi, all focused on delivering exceptional educational support.

            Act as a human-like assistant; your role is to respond in a friendly and helpful manner. Analyze the user question: \`${input}\`. 

            Here are some helpful links based on potential questions about EduGainer's:
            1. "How do I access the library section of EduGainer's?": "https://edugainers.com/library"
            2. "How can I pay the library fee?": "https://edugainers.com/library/fee-pay"
            3. "What classes can I enroll in at EduGainer?": "https://edugainers.com/classes"
            4. "How can I access the EduGainer homepage?": "https://edugainers.com/"
            5. "How do I log in to my EduGainer account?": "https://edugainers.com/login"
            6. "What is the process to register on the EduGainer website?": "https://edugainers.com/register"
            7. "What should I do if I forgot my password?": "https://edugainers.com/forgot-password"
            8. "How can I start chatting with the EduGainer assistant?": "https://edugainers.com/chat/home"
            9. "Where can I find the policies of EduGainer?": "https://edugainers.com/Policies"
            10. "What resources are available on the EduGainer platform?": "https://edugainers.com/resources"
            11. "How do I complete the new registration process?": "https://edugainers.com/new-reg"
            12. "How can I access my dashboard?": "https://edugainers.com/dashboard/:id" (replace :id with your user ID)
            13. "How can I view and edit my profile?": "https://edugainers.com/profile/:id" (replace :id with your user ID)
            14. "Where can I find stationery items on EduGainer?": "https://edugainers.com/stationary/home"
            15. "What resources are available on the EduGainer platform?": "https://edugainers.com/resources"
            Only provide a link if the user's question \`${input}\` matches one of the specified queries about EduGainer's services.
            `
        );

        const responseText = await result.response.text();
        const link = extractLink(responseText);

        // Generate follow-up questions
        const followUpQuestions = await generateFollowUpQuestions(chatSession, input,language);

        return {
            responseText,
            followUpQuestions,
            link
        };

    } else {
        const followUpQuestions = await generateFollowUpQuestions(chatSession, input);
        // Respond for irrelevant questions
        console.log(followUpQuestions)
        return {
            responseText: "I can only assist with inquiries related to EduGainer's services. Could you please ask a question related to EduGainer?",
            followUpQuestions: followUpQuestions,
            link: null
        };
    }
};

// Separate function to handle follow-up questions generation with error handling
const generateFollowUpQuestions = async (chatSession, input,language) => {
    try {
        const response = await chatSession.sendMessage(`
      
        
        You are an AI chatbot named Aiden, designed to assist users with EduGainer's services, which include the best library, classes, and stationery offerings in Uttarkashi.
        Your responses should sound human-like. 

        Based on the user's message: "${input}" and the conversation history, generate **exactly 3 follow-up questions** phrased from the user's perspective, in **language code \`${language}\` only**. 

        The questions should start with phrases like "Can I..." or "How can I...", and be formatted as an array:
        ["Question 1?", "Question 2?", "Question 3?"]
    `);
    


        const text = response.response.text().trim();
        console.log('Response:', text); // Log the raw response text

        const jsonPattern = /\[\s*"[^"]+"\s*,\s*"[^"]+"\s*,\s*"[^"]+"\s*\]/; // Updated regex pattern
        const match = text.match(jsonPattern);

        if (match) {
            console.log('Matched text:', match[0]); // Log the matched JSON array
            const questions = JSON.parse(match[0]);
            console.log(questions, "ques");
            const areQuestionsValid = questions.length === 3 && new Set(questions).size === 3;
            if (areQuestionsValid) {
                return questions;
            }
        }

        return ["Could you specify more about EduGainer's services?", "Do you have questions about the library?", "Would you like information on classes?"];
    } catch (error) {
        console.warn('Error generating follow-up questions:', error);
        return ["What would you like to know about EduGainer?", "How can I help with your EduGainer queries?", "Would you like details on EduGainer’s offerings?"];
    }
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