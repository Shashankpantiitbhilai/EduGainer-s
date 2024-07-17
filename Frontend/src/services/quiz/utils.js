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

export async function quizUpload(url) {
    try {
        // console.log(url)
        const response = await axiosInstance.post("/quiz/home", { url });
        // console.log(response.data)
        return response.data;
    } catch (error) {
        // console.error("Error fetching credentials:", error);
        return null;
    }
}

