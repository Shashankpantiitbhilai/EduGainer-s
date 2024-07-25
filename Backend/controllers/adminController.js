// Assuming you have an LibStudent model
const { LibStudent, User } = require('../models/student');
const { Message } = require("../models/chat");// Assuming you have a Shift model
const { Resource } = require('../models/Admin')
const { uploadToCloudinary } = require("../cloudinary")
const fs = require('fs');
const path = require('path');
const fetchAllChats = async (req, res) => {
    const { id } = req.params// Assuming shift is sent in the request body
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
const fetchAllUsers = async (req, res) => {
    // Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift

        const LibStudents = await LibStudent.find({})

        // console.log(LibStudents)
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteLibStudentById = async (req, res) => {
    const { id } = req.params;// Assuming shift is sent in the request body

    try {
        // Query database to find admins based on the shift

        const LibStudents = await LibStudent.findByIdAndDelete(id).exec();

        // console.log(LibStudents);
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const addLibStudent = async (req, res) => {
    // Assuming shift is sent in the request body
    const { image } = req.body;

    try {
        // Query database to find admins based on the shift
        const data = {
            ...req.body,
            
        }
       
        const addedStudent = await LibStudent.create(data);
        const imagedata = {}
        if (image) {
            const results = await uploadToCloudinary(image, "Library_Students");

            imagedata.publicId = results.publicId;
            imagedata.url = results.url;
            addedStudent.image = imagedata
        }
        await addedStudent.save();

        // console.log(addedstudent);
        // Example response structure

        res.status(200).json(addedStudent);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const editLibStudentById = async (req, res) => {
    const { id
    } = req.params// Assuming shift is sent in the request body

    try {
        // Query database to find admins based on the shift
        const { image } = req.body;

        const imagedata = {};
        const updatedstudent = await LibStudent.findByIdAndUpdate(id, { ...req.body }, { new: true }).exec();
        if (image) {
            const results = await uploadToCloudinary(image, "Library_Students");

            // Update the student record with image data
            imagedata.publicId = results.publicId;
            imagedata.url = results.url;
            updatedstudent.image = imagedata;
        }
        await updatedstudent.save();

        // Example response structure
        res.status(200).json(updatedstudent);
    } catch (error) {
        console.error("Error searching LibStudents by shift:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const uploadResource = async (req, res) => {
    const { name, tags } = req.body;

    const filePath = req.file.path;

    try {
        // Upload file to Cloudinary
        const result = await uploadToCloudinary(filePath, 'Library_Resources'); // Specify the folder name in Cloudinary

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

    const Name = req.body.name;
    // console.log(req.body)
    try {
        // Upload file to Cloudinary
        const resources = await Resource.findByIdAndUpdate(id, { name: Name }, { new: true });


        // Save the new resource to the database


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


    try {

        const resources = await Resource.findByIdAndDelete(id);


        // Save the new resource to the database


        // Send the Cloudinary URL in the response
        res.json(resources);
    } catch (error) {
        console.error(error);

        // Ensure local file is deleted even if Cloudinary upload fails


        res.status(500).json({ error: 'Error uploading file to Cloudinary' });
    }
};





const fetchAllSiteUsers = async (req, res) => {
    // Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift

        const LibStudents = await User.find({})

        // console.log(LibStudents)
        // Example response structure
        res.status(200).json(LibStudents);
    } catch (error) {
        console.error("Error searching LibStudents:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Export controller functions
module.exports = {
    addLibStudent,
    deleteLibStudentById,
    editLibStudentById,
    uploadResource,
    fetchLibResources,
    editLibResource,
    deleteLibResource,
    fetchAllUsers,
    fetchAllChats,
    fetchAllSiteUsers
    // Add other controller functions as needed
};
