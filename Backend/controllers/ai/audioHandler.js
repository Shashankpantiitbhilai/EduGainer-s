const textToSpeech = require('@google-cloud/text-to-speech');
const speechToText = require('@google-cloud/speech');

// Google Cloud API client initialization
const textToSpeechClient = new textToSpeech.TextToSpeechClient();
const speechToTextClient = new speechToText.SpeechClient();

// Text-to-Speech function
async function convertTextToSpeech(text) {
    const [response] = await textToSpeechClient.synthesizeSpeech({
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
        audioConfig: { audioEncoding: 'MP3' },
    });
    return response.audioContent;
}

// Speech-to-Text function
async function convertSpeechToText(audioContent) {
    const [response] = await speechToTextClient.recognize({
        config: {
            encoding: 'WEBM_OPUS', // Matches your frontend recording format
          
            languageCode: 'en-US',
            model: 'default',
            audioChannelCount: 1,
            enableAutomaticPunctuation: true,
        },
        audio: {
            content: audioContent,
        },
    });
    console.log(response.results)
    return response.results[0].alternatives[0].transcript;
}

module.exports = {
    convertTextToSpeech,
    convertSpeechToText,
};