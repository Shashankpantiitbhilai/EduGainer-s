const { AdminClass} = require('../../models/classes'); // Assuming this is the schema for classes
const { uploadToCloudinary } = require('../../cloudinary');
const cloudinary = require('cloudinary').v2;

// Add a new class
const addClass = async (req, res) => {
    const { name, description, facultyName,amount, duration, timing, content, additionalDetails, image } = req.body;

    try {
        let newClassData = {
            name,
            description,
            facultyName,
            duration,
            timing,
            amount,
            content,
            additionalDetails,
        };

        // If there is an image file, upload it to Cloudinary and save the URL and public ID
        if (image) {
            const result = await uploadToCloudinary(image, "Classes");

            // Save the image URL and public ID to the newClassData object
            newClassData.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        // Create a new class record with the provided data
        const newClass = new AdminClass(newClassData);
        await newClass.save();

        // Respond with the newly created class data
        res.status(201).json(newClass);
    } catch (error) {
        console.error("Error creating class:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Edit a class
const editClass = async (req, res) => {
    const { id } = req.params; // Get class ID from request params
    const { name, description, facultyName,amount, duration, timing, content, additionalDetails, image } = req.body;

    try {
        // Find the current class
        const currentClass = await AdminClass.findById(id);

        if (!currentClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        let updateData = {
            name,
            description,
            facultyName,
            duration,
            timing,
            content,
            amount,
            additionalDetails,
        };

        // If there is an image file, handle the image update
        if (image) {
            // Delete the old image from Cloudinary if it exists
            if (currentClass.image && currentClass.image.publicId) {
                await cloudinary.uploader.destroy(currentClass.image.publicId);
            }

            // Upload the new image to Cloudinary
            const result = await uploadToCloudinary(image, "Classes");

            // Save the new image URL and public ID to the updateData object
            updateData.image = {
                url: result.url,
                publicId: result.publicId
            };
        }

        // Update the class record with the new data
        const updatedClass = await AdminClass.findByIdAndUpdate(id, updateData, { new: true });
      
        if (!updatedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Respond with the updated class data
        res.status(200).json(updatedClass);
    } catch (error) {
        console.error("Error updating class:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete a class
const deleteClass = async (req, res) => {
    const { id } = req.params; // Get class ID from request params
    console.log(id);
    try {
        // Find the class by ID
        const classData = await AdminClass.findById(id);
        console.log(classData);
        if (!classData) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Delete image from Cloudinary if it exists
        if (classData.image && classData.image.publicId) {
            await cloudinary.uploader.destroy(classData.image.publicId);
        }

        // Delete the class from the database
        const deletedClass = await AdminClass.findByIdAndDelete(id);

        if (!deletedClass) {
            return res.status(404).json({ error: "Class not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Class deleted successfully" });
    } catch (error) {
        console.error("Error deleting class:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get all classes
const getClasses = async (req, res) => {
    try {
        // Fetch all classes from the database
        const classes = await AdminClass.find();

        // Respond with the classes data
        res.status(200).json(classes);
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Export controller functions
module.exports = {
    addClass,
    editClass,
    deleteClass,
    getClasses
};
