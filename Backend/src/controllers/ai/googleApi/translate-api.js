
const { TranslationServiceClient } = require('@google-cloud/translate');
const translationClient = new TranslationServiceClient();
const projectId = process.env.GOOGLE_PROJECT_ID || JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON).project_id;
const location = 'global';
 const translateText = async (textArray, targetLanguage) => {
    try {
        // Replace "EduGainer" with a unique placeholder
        const placeholder = '##EDUGAINER##';
        const modifiedTextArray = textArray.map(text => text.replace(/EduGainer's/g, placeholder));

        const [response] = await translationClient.translateText({
            parent: translationClient.locationPath(projectId, location),
            contents: modifiedTextArray,
            targetLanguageCode: targetLanguage,
            mimeType: 'text/plain',
        });

        // Replace placeholder back with "EduGainer"
        return response.translations.map(translation =>
            translation.translatedText.replace(new RegExp(placeholder, 'g'), "EduGainer's")
        );
    } catch (error) {
        console.error('Error in translation:', error);
        return textArray; // Fallback to original text if translation fails
    }
};
module.exports={translateText}