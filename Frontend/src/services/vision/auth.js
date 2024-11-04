// src/services/visionService.js
import axiosInstance from "../axiosInstance";

export const analyzeImage = async (base64Image) => {
    try {
        const response = await axiosInstance.post("/vision/analyze-image", {
            image: base64Image,
        });

        return response.data.labels; // Returns detected labels
    } catch (error) {
        console.error("Error in Vision API call:", error);
        throw new Error("Failed to analyze image");
    }
};
