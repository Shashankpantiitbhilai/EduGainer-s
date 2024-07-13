import axios from "axios";

// Determine the baseURL based on the environment
const baseURL = process.env.NODE_ENV === 'production'
    ? "https://edu-gainer-s-backend.vercel.app"
    : "http://localhost:8000";
console.log(baseURL)
const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export async function makeSeatEmpty(seat,shift) {
  
    try {
        const response = await axiosInstance.patch("/admin/makeSeatEmpty", { seat,shift });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

