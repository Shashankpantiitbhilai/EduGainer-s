const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure environment variables are loaded

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadToCloudinary = async (filePath, folder) => {
    try {
        // console.log(filePath)
        const data = await cloudinary.uploader.upload(filePath, { folder: folder });
        return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
        console.error('Error uploading to Cloudinary:', err);
        throw err;
    }
};

module.exports = { uploadToCloudinary };
