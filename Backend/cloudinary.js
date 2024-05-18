const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

const uploadToCloudinary = async (image, folder = "Library_Students") => {
   
    try {
        const data = await cloudinary.uploader.upload(image, { folder: folder });
        return { url: data.secure_url, publicId: data.public_id };
    } catch (err) {
        console.log(err);
        throw err;
    }
};
module.exports = { uploadToCloudinary }
