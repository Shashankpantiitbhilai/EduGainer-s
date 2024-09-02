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

// Function to add a new event
export async function addEvent(data) {
    try {
        const response = await axiosInstance.post("/admin_event/addEvent", data);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to edit an existing event by ID
export async function editEvent(id, data) {
    try {
        
        const response = await axiosInstance.patch(`/admin_event/editEvent/${id}`, data);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to delete an event by ID
export async function deleteEvent(id) {
    try {
        const response = await axiosInstance.delete(`/admin_event/deleteEvent/${id}`);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to fetch all events
export async function getAllEvents() {
    try {
        const response = await axiosInstance.get("/admin_event/getAllEvents");
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to fetch a single event by ID
