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
