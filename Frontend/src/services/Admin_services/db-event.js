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
export const fetchLogs = async () => {
    try {
        const response = await axiosInstance.get('/db-events/logs');
        return response.data; // Assuming the response contains the logs
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error; // Rethrow error for handling in the component
    }
};
