// server/controllers/translateController.js
const { Translate } = require('@google-cloud/translate').v2;

// Initialize Google Translate with environment variable
const translate = new Translate({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Controller function for translating text
const translateText = async (req, res) => {
    const { contentToTranslate, targetLanguage } = req.body;

    if (!contentToTranslate || !targetLanguage) {
        return res.status(400).json({ error: 'Content to translate and target language are required.' });
    }

    try {
        // Create an object to store the translated content
        const translations = {};

        // Iterate through the content to translate and perform translation
        for (const [key, text] of Object.entries(contentToTranslate)) {
            const [translation] = await translate.translate(text, targetLanguage);
            translations[key] = translation;
        }

        res.status(200).json({ translations });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed. Please try again later.' });
    }
};

module.exports = {
    translateText,
};