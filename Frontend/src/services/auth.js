import axios from "axios";

const baseURL = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchCredentials() {
  try {
    const response = await axiosInstance.get("/auth/fetchAuth");
    return response.data;
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return null;
  }
}

export async function registerUser(email, password) {
  try {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      return { Message: "User already exists." }; // Return error message to handle on the client side
    } else {
      console.error("Error registering user:", error);
      return null;
    }
  }
}


export async function loginUser(email, password) {
  try {
    console.log(email, password);
    const response = await axiosInstance.post("/auth/login", { email, password });
    // console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    return null;
  }
}

export async function registerStudentId(id, ID_No) {
  try {
    const response = await axiosInstance.post("/auth/google/register", { id, ID_No });
    return response.data;
  } catch (error) {
    console.error("Error registering student ID:", error);
    return null;
  }
}

export async function logoutUser() {
  try {
    await axiosInstance.post("/auth/logout");
    return;
  } catch (error) {
    console.error("Error logging out user:", error);
  }
}

