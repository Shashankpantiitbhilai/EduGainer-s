const vision = require("@google-cloud/vision");

// Instantiate a Vision API client
const client = new vision.ImageAnnotatorClient();

exports.analyzeImage = async (req, res) => {
    try {
        // Extract base64 image data from the request body
        const { image } = req.body;
        if (!image) {
            return res.status(400).json({ error: "Image data is required" });
        }

        // Prepare the image data for the Vision API
        const request = {
            image: {
                content: image, // base64 encoded image data
            },
            features: [{ type: "LABEL_DETECTION" }], // Modify based on your analysis needs
        };

        // Send request to Vision API
        const [result] = await client.annotateImage(request);

        // Extract and send response
        const labels = result.labelAnnotations.map((label) => label.description);
        res.status(200).json({ labels });
    } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Failed to analyze image" });
    }
};
