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
export async function verifyLibraryAccess( email, password) {
    try {
        console.log("verify")
        const response = await axiosInstance.post(`/admin/team/verifyRoleForLibrary`, {
            email,
            password
        });
console.log(response.data,"data")
        // Return response data if the request is successful
        return response.data;
    } catch (error) {
        console.error("Error verifying library access:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}