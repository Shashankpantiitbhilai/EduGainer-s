import axios from "axios";

const baseURL = process.env.NODE_ENV === 'production'
  ? "https://edu-gainer-s-backend.vercel.app"
  : "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function sendFormData(formData) {
  console.log(formData)
  try {
    const response = await axiosInstance.post("/classes/new-reg", formData);
    return response.data;
  } catch (error) {
    console.error("Error sending form data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function fetchUserClassesDataById(user_id) {
  try {
    const response = await axiosInstance.get(`/classes/${user_id}`);
    console.log(response.data);// Adjust the endpoint as per your API
    return response.data; // Assuming the API returns JSON data representing the user object
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function sendIdCard(id) {
  try {

    const response = await axiosInstance.get(`/Lib_student/sendIdCard/${id}`); // Adjust the endpoint as per your API
    return response.data; // Assuming the API returns JSON data representing the user object
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function updateUserDetails(id, data) {
  try {
    console.log(id, data);
    const response = await axiosInstance.put(`/profile/${id}`, data);
    console.log(response);
    return response.data; // Assuming the API returns JSON data representing the user object
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      console.error("Error request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error message:", error.message);
    }
    console.error("Error config:", error.config);
    throw error; // Propagate the error to handle it in the calling component
  }
}


