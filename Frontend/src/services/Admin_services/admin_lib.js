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
export async function getBookingData() {

    try {
        console.log("hi")
        const response = await axiosInstance.get("/admin_library/getBookingData");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function updateColor(id, column, color) {

    try {
        console.log(id, column, color)
        const response = await axiosInstance.patch("/admin_library/updateColor",{id,column,color});
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function getLegends() {
    try {
        const response = await axiosInstance.get("/admin_library/getLegends");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching legends:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function addLegend(legend) {
    try {
        console.log(legend)
        const response = await axiosInstance.post("/admin_library/addLegend", legend);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding legend:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function deleteLegend(id) {
    try {
        console.log(id)
        const response = await axiosInstance.delete(`/admin_library/deleteLegend/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting legend:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function deleteBooking(id) {
    try {
        console.log(id)
        const response = await axiosInstance.delete(`/admin_library/deleteBooking/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error deleting legend:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}
export async function addBooking(data) {
    try {
        console.log(data)
        const response = await axiosInstance.post(`/admin_library/addBooking`,data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding booking:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}
export async function updateBooking(data) {
    try {
        console.log(data)
        const response = await axiosInstance.post(`/admin_library/updateBooking`,data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error updating booking:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}