// textToSpeechTranslation.js

const textToSpeech = require('@google-cloud/text-to-speech');
const textToSpeechClient = new textToSpeech.TextToSpeechClient();



// Supported languages for audio response with language codes
const supportedAudioLanguages = {
    en: 'en-US',
    hi: 'hi-IN',
    bn: 'bn-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    pa: 'pa-IN',
    ur: 'ur-IN'
};

// Translate text to a specified language


// Synthesize speech based on language and text input
async function synthesizeSpeech(text, language, ssmlGender = 'MALE') {
    console.log("texttospeech")
    const languageCode = supportedAudioLanguages[language] || 'en-US';
    const request = {
        input: { text },
        voice: { languageCode, ssmlGender },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        const [response] = await textToSpeechClient.synthesizeSpeech(request);
        console.log(response)
        return response.audioContent.toString('base64');  // Return audio as base64 string
    } catch (error) {
        console.error('Error in text-to-speech synthesis:', error);
        throw error;
    }
}

module.exports = {
   
    synthesizeSpeech
};
