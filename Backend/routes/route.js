const express = require("express");
const passport = require("../models/passportConfig");
const router = express.Router();
const { User, Student } = require("../models/student");
const { uploadToCloudinary } = require("../cloudinary");

router.post("/Lib-new-reg", async (req, res) => {
    const { name, email, image, mobile, shift, address } = req.body;
    // console.log(image.path);
    try {
        let imageData = {};
        if (image) {
            const results = await uploadToCloudinary(image, "Library_Students"); // Assuming image.path is the path to the uploaded file
            imageData = results;
        }
        console.log(imageData.url, " ", imageData.publicId);
        // console.log(results);
        const user = await Student.create({
            name,
            email,
            shift,
            mobile,
            address,
            image: {
 publicId: imageData.publicId,
                url: imageData.url,



            }
        })



        res.status(200).json(user);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "A server error occurred with this request" });
    }
});

module.exports = router;
