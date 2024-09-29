import { gridColumnsTotalWidthSelector } from "@mui/x-data-grid";
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

// Function to add a new class
export async function addClass(data) {
    try {
        console.log(data)
        const response = await axiosInstance.post("/admin_classes/addClass", data);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to edit an existing class by ID
export async function editClass(id, data) {
    try {
        const response = await axiosInstance.patch(`/admin_classes/editClass/${id}`, data);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to delete a class by ID
export async function deleteClass(id) {
    try {
        const response = await axiosInstance.delete(`/admin_classes/deleteClass/${id}`);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to fetch all classes
export async function getAllClasses() {
    try {
        const response = await axiosInstance.get("/admin_classes/getAllClasses");
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}

// Function to fetch a single class by ID
export async function getClassById(id) {
    try {
        const response = await axiosInstance.get(`/admin_classes/getClass/${id}`);
        return response.data;
    } catch (error) {
        throw error; // Propagate the error to handle it in the calling component
    }
}
export async function getBatchStudent(batchId) {
    try {

        // Make the POST request to the server with batchId
        const response = await axiosInstance.get(`/admin_classes/getBatchData/${batchId}`);

        // Return the response data, likely the student list
        return response.data;
    } catch (error) {
        // Handle any errors here
        throw error; // Propagate the error to handle it in the calling component
    }
}