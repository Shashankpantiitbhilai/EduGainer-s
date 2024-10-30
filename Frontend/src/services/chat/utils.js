import axios from "axios";

// Determine the baseURL based on the environment

const baseURL =
    process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV;
console.log(baseURL)
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function fetchChatMessages() {

    try {
        const response = await axiosInstance.get("/chat/fetchChatMessages");
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function postChatMessages(messagedata) {

    try {
        // console.log(messagedata)
        const response = await axiosInstance.post("/chat/postChatMessages", messagedata);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function fetchAdminCredentials() {
    try {
        const response = await axiosInstance.get("/chat/fetchAdminCredentials");
        // console.log("utils", response);
 

        // Log individual properties to ensure they are correctly parsed
        // console.log("Parsed _id:", _id);
        // console.log("Role:", role);
        // console.log("Strategy:", strategy);
        // console.log("Username:", username);

        return response.data[0];
    } catch (error) {
        // console.error("Error fetching credentials:", error);
        return null;
    }
}


// services/chat/utils.js

export async function makeAllMessagesSeenForUser(userRoomId) {
    try {
        const response = await axiosInstance.post("/chat/makeAllMessagesSeen", { userRoomId });
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// services/chat/utils.js

export async function fetchUnseenMessages() {
    try {
        const response = await axiosInstance.get("/chat/findUnseenMessage");
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}
// services/chat/utils.js

export async function updateSeenMessage(userId) {
    try {
        const response = await axiosInstance.patch("/chat/updateSeenMessage", { userId });
        return response.data; // Return the response data
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

