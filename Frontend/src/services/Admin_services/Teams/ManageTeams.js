
import axiosInstance from "../../axiosInstance";
export async function fetchAllTeamAccounts() {
    try {
        const response = await axiosInstance.get("/admin/team/getTeam-accounts");
        return response.data; // Return the data received from the response
    } catch (error) {
        console.error("Error fetching team accounts:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}
export async function addUser(userData, adminId) {
    try {
        // Note: Do not set Content-Type explicitly; FormData will set it for us.
        const response = await axiosInstance.post(`/admin/team/addTeam-member/${adminId}`, userData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error adding new user:", error);
        throw error;
    }
}


// Delete a user by ID
export async function deleteUserById(id) {
    try {
        const response = await axiosInstance.delete(`/admin/team/deleteUser/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        throw error;
    }
}