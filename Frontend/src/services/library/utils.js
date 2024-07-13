import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production'
    ? "https://edu-gainer-s-backend.vercel.app"
    : "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function getSeatsData() {

    try {
        const response = await axiosInstance.get("/library/getSeatStatus");
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

