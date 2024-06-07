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

export async function fetchLibSudents(query) {
    console.log(query, 111);
    try {
        const response = await axiosInstance.get("/admin/fetchLibData", { params: query });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function deleteLibStudent(id) {
    try {
        const response = await axiosInstance.delete(`/admin/deleteLibStudent/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function editLibStudentById(id, data) {
    console.log(id, data);
    try {
        const response = await axiosInstance.patch(`/admin/editLibStudent/${id}`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export const fileUpload = async (data, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', data);
    console.log(data);
    // for (let pair of formData.entries()) {
    //     console.log(pair[0], pair[1]);
    // }
    const response = await axiosInstance.post('/admin/uploadResource', data, {
        onUploadProgress,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data; // Assuming the response contains the necessary data
};

export const fetchLibResources = async (data) => {
    try {
        console.log(data);
        const response = await axiosInstance.post('/admin/fetchLibResource', { data });
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("error fetching data:", error);
        throw error;
    }
};

export const editLibResources = async (id, data) => {
    console.log(data);
    try {
        const response = await axiosInstance.patch(`/admin/editLibResource/${id}`, data);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("error fetching data:", error);
        throw error;
    }
};

export const deleteLibResource = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/deleteLibResource/${id}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("error fetching data:", error);
        throw error;
    }
};
