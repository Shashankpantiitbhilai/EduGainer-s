import axios from "axios";
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

export async function fetchTrafficData() {
    try {
        console.log("hi")
        // Make the API call to fetch traffic data from the backend
        const response = await axiosInstance.get("/traffic/traffic-data");
        console.log( "response",response.data);
        // Return the data (you can process/format it as needed for display)
        return response.data;
    } catch (error) {
        console.error("Error fetching traffic data:", error);
        return null; // Return null or handle the error appropriately
    }
}