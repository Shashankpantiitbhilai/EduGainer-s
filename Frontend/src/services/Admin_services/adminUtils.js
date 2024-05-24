import axios from "axios";

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
export async function fetchLibSudents(query) {
    console.log(query, 111)
    try {
        const response = await axiosInstance.get("/admin/fetchLibData", { params: query });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

