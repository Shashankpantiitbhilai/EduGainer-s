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

export async function editUserById(id, data) {

    try {
        const response = await axiosInstance.patch(`/admin/editUser/${id}`, { data });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

