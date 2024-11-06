import axios from "axios";

// Determine the baseURL based on the environment
const baseURL =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV;

// Create axios instance for regular JSON requests
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Create axios instance for multipart/form-data requests
const axiosFileInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

// Function to send user text to the chatbot
export async function sendMessageToChatbot(userInput,language) {
    try {
        console.log(language,"lang")
        const response = await axiosInstance.post(`/gemini/chatbot/${language}/true`, {
            input: userInput
        });
        console.log("Text response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending message to chatbot:", error);
        throw formatError(error);
    }
}

// Function to send file to the chatbot
export async function sendFileToChatbot(file, prompt, onProgress = null) {
    try {
        // Validate file before sending
        validateFile(file);

        // Create FormData and append file and prompt
        const formData = new FormData();
        formData.append("file", file);
        formData.append("prompt", prompt);

        // Configure request with progress tracking
        const config = {
            onUploadProgress: onProgress ? (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            } : undefined
        };

        const response = await axiosFileInstance.post(
            "/gemini/chatbot/file",
            formData,
            config
        );

        console.log("File upload response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending file to chatbot:", error);
        throw formatError(error);
    }
}

// Helper function to validate file
function validateFile(file) {
    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        throw new Error("File size exceeds 5MB limit");
    }

    // Check file type
    const allowedTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
        throw new Error("Invalid file type. Only PDF and images (PNG, JPEG, GIF) are allowed.");
    }
}

// Helper function to format error messages
function formatError(error) {
    if (error.response) {
        // Server responded with error
        return new Error(error.response.data.error || "Server error occurred");
    } else if (error.request) {
        // Request made but no response
        return new Error("No response from server. Please check your connection.");
    } else {
        // Error in request setup
        return error;
    }
}

export async function processAudioInput(audioBlob) {
    try {
        // Create FormData and append the audio blob with proper filename
        const formData = new FormData();
        formData.append('audio', audioBlob, 'audio.webm');

        // Set proper headers for multipart/form-data
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        };

        const response = await axiosFileInstance.post('/gemini/chatbot/processAudio', formData, config);
        return response.data;
    } catch (error) {
        console.error("Error processing audio:", error);
        throw formatError(error);
    }
}