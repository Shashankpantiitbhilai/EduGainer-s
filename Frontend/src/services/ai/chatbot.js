import axios from "axios";

// Determine the baseURL based on the environment
const baseURL =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV;

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Function to send user text to the chatbot
export async function sendMessageToChatbot(userInput) {
    try {
        const response = await axiosInstance.post("/gemini/chatbot", { input: userInput });
        console.log(response.data, "response");
        return response.data; // Assuming the response contains the chatbot's reply
    } catch (error) {
        console.error("Error sending message to chatbot:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}
