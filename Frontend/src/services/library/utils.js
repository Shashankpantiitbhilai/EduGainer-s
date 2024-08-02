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

export async function getSeatsData() {

    try {
        const response = await axiosInstance.get("/library/getSeatStatus");
        // console.log(response.data)
        return response.data;
    } catch (error) {
        // console.error("Error sending form data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function eligibleForNewRegistration(user_id) {
    try {
        // console.log(user_id)
        const response = await axiosInstance.get(`/library/eligibleForRegistration/${user_id}`);
        // console.log(response.data);// Adjust the endpoint as per your API
        return response.data; // Assuming the API returns JSON data representing the user object
    } catch (error) {
        // console.error("Error fetching user data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function fetchLibStudent(reg) {
   
    try {
        // console.log(user_id)
        const response = await axiosInstance.get(`/library/fetchStudent/${reg}`);
        // Adjust the endpoint as per your API
        return response.data; // Assuming the API returns JSON data representing the user object
    } catch (error) {
        // console.error("Error fetching user data:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}


export async function getStudentLibSeat(id) {
    try {
    
        const response = await axiosInstance.get(`/library/getStudentLibSeat/${id}`);
        // console.log(response.data);// Adjust the endpoint as per your API
        return response.data; // Assuming the API returns JSON data representing the user object
    } catch (error) {
        // console.error("Error fetching user seats:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}



export async function sendFeeData(amount,status) {
    try {
     
        const response = await axiosInstance.post("/library/sendFeeData", { amount, status });
       
        // console.log(response.data);// Adjust the endpoint as per your API
        return response.data; // Assuming the API returns JSON data representing the user object
    } catch (error) {
        // console.error("Error fetching user seats:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

export async function updateMonthlyStatus(reg,status) {
    try {
       
      
        const response = await axiosInstance.patch(`/library/updateMonthlyStatus/${reg}`,{status});
      
        // console.log(response.data);// Adjust the endpoint as per your API
        return response.data; // Assuming the API returns JSON data representing the user object
    } catch (error) {
        // console.error("Error fetching user seats:", error);
        throw error; // Propagate the error to handle it in the calling component
    }
}

