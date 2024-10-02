import axios from "axios";

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

export async function sendFormData(formData) {
  // console.log(formData)
  try {
    const response = await axiosInstance.post("/classes/new-reg", formData);
    return response.data;
  } catch (error) {
    // console.error("Error sending form data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function getClassStudentInfo(userId) {
  try {
    // Send a GET request to the server with the userId as a parameter
    const response = await axiosInstance.get(`/classes/getStudentDetails/${userId}`);

    // Return the student data received from the server
    return response.data;
  } catch (error) {
    // Log the error if the request fails
    console.error("Error fetching student details:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}
export async function sendIdCard(id) {
  try {
    // console.log(id, "reached utils")
    const response = await axiosInstance.get(`/classes/sendIdCard/${id}`); // Adjust the endpoint as per your API
    return response.data; // Assuming the API returns JSON data representing the user object
  } catch (error) {
    // console.error("Error fetching user data:", error);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function updateUserDetails(id, data) {
  try {
    // console.log(id, data);
    const response = await axiosInstance.put(`/profile/${id}`, data);
    // console.log(response);
    return response.data; // Assuming the API returns JSON data representing the user object
  } catch (error) {
    if (error.response) {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      // console.error("Error response data:", error.response.data);
      // console.error("Error response status:", error.response.status);
      // console.error("Error response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made, but no response was received
      // console.error("Error request data:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.error("Error message:", error.message);
    }
    // console.error("Error config:", error.config);
    throw error; // Propagate the error to handle it in the calling component
  }
}

export async function getStudentDetails(userId,BatchId) {
  try {
    const response = await axiosInstance.get(`/classes/getStudentDetails/${userId}/${BatchId}`
    );

    return response.data; // Return the student details from the response
  } catch (error) {
    console.error("Error fetching student details:", error);
    throw new Error("Unable to fetch student details.");
  }
}

export const eligibleForNewRegistration = async (userId, classId) => {
 
  try {
    const response = await axiosInstance.post(`/classes/eligibility/${classId}`, {
      user_id: userId,
    });

    return response.data;
  } catch (error) {
    console.error("Error checking eligibility:", error);
    throw new Error("Unable to check eligibility.");
  }
};
export const createOrder = async (amount) => {
  try {
  
    const response = await axiosInstance.post("classes/create-order", { amount });
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating order:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
};

// Function to verify payment
export const verifyPayment = async (userId, orderData) => {
  try {
    const response = await axiosInstance.post(`classes/payment-verification/${userId}`, orderData);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error; // Rethrow the error for handling in the calling component
  }
}
