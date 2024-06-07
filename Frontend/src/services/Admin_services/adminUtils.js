import axios from "axios";

const baseURL = "https://edu-gainer-s-backend.vercel.app";

const axiosInstance = axios.create({
    baseURL,
    withCredentials: true,

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

export async function deleteLibStudent(id) {
    // console.log(id, "id")
    try {
        const response = await axiosInstance.delete(`/admin/deleteLibStudent/${id}`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}
export async function editLibStudentById(id, data) {
    console.log(id, data)
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
    for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }
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
        console.log(data)
        const response = await axiosInstance.post('/admin/fetchLibResource', { data })
        console.log(response.data)
        return response.data;
    }
    catch (error) {
        console.error("error fetching data:", error)

    }
    // Assuming the response contains the necessary data
};





export const editLibResources = async (id, data) => {
    console.log(data)
    try {
        const response = await axiosInstance.patch(`/admin/editLibResource/${id}`, data)
        console.log(response.data)
        return response.data;
    }
    catch (error) {
        console.error("error fetching data:", error)

    }
    // Assuming the response contains the necessary data
};


export const deleteLibResource = async (id) => {
    try {
        const response = await axiosInstance.delete(`/admin/deleteLibResource/${id}`)
        console.log(response.data)
        return response.data;
    }
    catch (error) {
        console.error("error fetching data:", error)

    }
    // Assuming the response contains the necessary data
};

