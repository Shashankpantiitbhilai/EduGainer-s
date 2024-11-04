import axiosInstance from "../axiosInstance";

export const translateContent = async (content, targetLanguage) => {
    try {
        const response = await axiosInstance.post("/translate/website-content", {
            text: content,
            targetLanguage,
        });

        return response.data.translation; // Returns the translated content
    } catch (error) {
        console.error("Error in Translation API call:", error);
        throw new Error("Failed to translate content");
    }
};
