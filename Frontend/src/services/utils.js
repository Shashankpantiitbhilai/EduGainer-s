import axios from "axios";

const baseURL = "http://localhost:8000";

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
    const response = await axiosInstance.post("/Lib-new-reg", formData);
    return response.data;
  } catch (error) {
    console.error("Error sending form data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function fetchUserDataById(user_id) {
  try {
    const response = await axiosInstance.get(`/Lib_student/${user_id}`);
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

