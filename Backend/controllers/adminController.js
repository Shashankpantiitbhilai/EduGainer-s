// Assuming you have an Student model
const { Student } = require('../models/student'); // Assuming you have a Shift model
const { Resource } = require('../models/Admin')
const { uploadToCloudinary } = require("../cloudinary")
const fs = require('fs');
const path = require('path');

// Example function to search Students by shift
const searchStudentsByShift = async (req, res) => {
    const { shift } = req.query;// Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift
        let students = []
        if (!shift) {
            students = await Student.find({})
        }
        else {
            students = await Student.find({ shift: shift }).exec();
        }
        console.log(students)
        // Example response structure
        res.status(200).json(students);
    } catch (error) {
        console.error("Error searching Students by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteStudentById = async (req, res) => {
    const { id } = req.params;// Assuming shift is sent in the request body
    console.log(req.params, "reached controller");
    try {
        // Query database to find admins based on the shift

        const students = await Student.findByIdAndDelete(id).exec();

        console.log(students);
        // Example response structure
        res.status(200).json(students);
    } catch (error) {
        console.error("Error searching Students by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const editStudentById = async (req, res) => {
    const id = req.body._id// Assuming shift is sent in the request body
    console.log(id, req.body, "reached controller of edit");
    try {
        // Query database to find admins based on the shift

        const student = await Student.findByIdAndUpdate(id, req.body, { new: true }).exec();

        console.log(student);
        // Example response structure
        res.status(200).json(student);
    } catch (error) {
        console.error("Error searching Students by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const uploadResource = async (req, res) => {
    const { name, tags } = req.body;
    console.log(req.body)
    console.log(req.file)
    const filePath = req.file.path;

    try {
        // Upload file to Cloudinary
        const result = await uploadToCloudinary(filePath, 'Library_Resources'); // Specify the folder name in Cloudinary
        console.log(result);
        const newResource = new Resource({
            name,
            tags, // Assuming tags are sent as a comma-separated string
            url: result.url,
        });

        // Save the new resource to the database
        await newResource.save();
        // Delete the file locally after uploading to Cloudinary
        fs.unlinkSync(filePath);

        // Send the Cloudinary URL in the response
        res.json({ newResource });
    } catch (error) {
        console.error(error);

        // Ensure local file is deleted even if Cloudinary upload fails
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};
const fetchLibResources = async (req, res) => {

    const Name = req.body.data;
    console.log(Name);
    try {
        let resources = [];
        // Upload file to Cloudinary
        if (!Name)
            resources = await Resource.find({});

        else {
            resources = await Resource.find({ name: Name });
        }
        // Save the new resource to the database
        console.log(resources)

        // Send the Cloudinary URL in the response
        res.json(resources);
    } catch (error) {
        console.error(error);

        // Ensure local file is deleted even if Cloudinary upload fails


        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};











const editLibResource = async (req, res) => {

    const { id
    } = req.params;
    console.log(id);
    const Name = req.body.name;
    // console.log(req.body)
    try {
        // Upload file to Cloudinary
        const resources = await Resource.findByIdAndUpdate(id, { name: Name }, { new: true });


        // Save the new resource to the database
        console.log(resources)

        // Send the Cloudinary URL in the response
        res.json(resources);
    } catch (error) {
        console.error(error);

        // Ensure local file is deleted even if Cloudinary upload fails


        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};
const deleteLibResource = async (req, res) => {

    const { id
    } = req.params;
    console.log(id);

    try {

        const resources = await Resource.findByIdAndDelete(id);


        // Save the new resource to the database
        console.log(resources)

        // Send the Cloudinary URL in the response
        res.json(resources);
    } catch (error) {
        console.error(error);

        // Ensure local file is deleted even if Cloudinary upload fails


        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};






// Export controller functions
module.exports = {
    searchStudentsByShift,
    deleteStudentById,
    editStudentById,
    uploadResource,
    fetchLibResources,
    editLibResource,
    deleteLibResource
    // Add other controller functions as needed
};
