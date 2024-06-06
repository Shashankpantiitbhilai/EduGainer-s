import axios from "axios";

const baseURL = "https://edu-gainer-s.vercel.app";

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
      return { message: "User already exists" }; // Return error message to handle on the client side
    } else {

      console.error("Error registering user:", error);
      return null;
    }
  }
}


export async function verifyOTPAndRegisterUser(otp) {
  console.log(otp);
  try {
    const response = await axiosInstance.post("/auth/otp-verify", { otp });
    console.log(response);
    if (response.status === 201) {
      console.log("User registered successfully!");
      return { success: true, message: "User registered successfully" ,user:response};
    } else if (response.status === 400) {
      throw new Error("Invalid OTP: " + response.data.message);
    } else {
      throw new Error("Error registering user: " + response.data.message);
    }
  } catch (error) {
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    console.log(email, password);
    const response = await axiosInstance.post("/auth/login", { email, password });
    console.log(response);
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

export async function forgotPassword(email) {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", { email });
    console.log(response);
    if (response.data.Status === "Success") {
      // Redirect to login page upon successful password reset
      return response.data
    }
  } catch (error) {
    console.error("Error resetting password:", error);
  }
}
export async function resetPassword(password, id, token) {
  try {
    const response = await axiosInstance.post(`/auth/reset-password/${id}/${token}`, { password });
    console.log(response);
    if (response.data.success) {
      console.log("Password reset successfully!");
      return { success: true, message: "Password reset successfully" };
    } else {
      throw new Error("Error resetting password: " + response.data.message);
    }
  } catch (error) {
    throw error;
  }
}