// Assuming you have an LibStudent model
const { LibStudent, User } = require('../models/student');
const { Message } = require("../models/chat");// Assuming you have a Shift model
const { Resource } = require('../models/Admin')
const { uploadToCloudinary } = require("../cloudinary")
const fs = require('fs');
const path = require('path');
const fetchAllChats = async (req, res) => {
    const { id }=req.params// Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift
       
       const chats = await Message.find({ user: id });
        // console.log(chats)
        // Example response structure
        res.status(200).json(chats);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Example function to search LibStudents by shift
const searchLibStudentsByShift = async (req, res) => {
    const { shift } = req.query;// Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift
        let LibStudents = []
        if (!shift) {
            LibStudents = await LibStudent.find({})
        }
        else {
            LibStudents = await LibStudent.find({ shift: shift }).exec();
        }
        console.log(LibStudents)
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
// Example function to search LibStudents by shift
const fetchAllUsers = async (req, res) => {
    // Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift
       
       const LibStudents = await User.find({})
        
        // console.log(LibStudents)
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteLibStudentById = async (req, res) => {
    const { id } = req.params;// Assuming shift is sent in the request body
    console.log(req.params, "reached controller");
    try {
        // Query database to find admins based on the shift

        const LibStudents = await LibStudent.findByIdAndDelete(id).exec();

        console.log(LibStudents);
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const editLibStudentById = async (req, res) => {
    const id = req.body._id// Assuming shift is sent in the request body
    console.log(id, req.body, "reached controller of edit");
    try {
        // Query database to find admins based on the shift

        const LibStudent = await LibStudent.findByIdAndUpdate(id, req.body, { new: true }).exec();

        console.log(LibStudent);
        // Example response structure
        res.status(200).json(LibStudent);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
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
    
        if (!Name)
            resources = await Resource.find({});

        else {
            resources = await Resource.find({ name: Name });
        }
        // Save the new resource to the database
        // console.log(resources)

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
    searchLibStudentsByShift,
    deleteLibStudentById,
    editLibStudentById,
    uploadResource,
    fetchLibResources,
    editLibResource,
    deleteLibResource,
    fetchAllUsers,
    fetchAllChats
    // Add other controller functions as needed
};
