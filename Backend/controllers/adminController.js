// Assuming you have an LibStudent model
const { LibStudent, User } = require('../models/student');
const { Message } = require("../models/chat");// Assuming you have a Shift model
const { Resource } = require('../models/Admin')
const { uploadToCloudinary } = require("../cloudinary")
const fs = require('fs');

const editUserById = async (req, res) => {
    const { id } = req.params// Assuming shift is sent in the request body
    console.log(id,req.body.data)
    try {
        // Query database to find admins based on the shift

        const user = await User.findByIdAndUpdate({ _id:id },{...req.body.data},{new:true});
        // console.log(chats)
        // Example response structure
        console.log(user)
        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
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



const addUser = async (req, res) => {
    const { email, password, firstName, lastName, role, permissions } = req.body;
    const adminId = req.params.adminId; // ID of the admin document to update
    console.log(req.body,adminId);

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email.' });
        }

        // Create a new user with the provided fields, including permissions
        const newUser = new User({
            username: email,
            firstName,
            lastName,
            role, // 'user', 'admin', or 'employee', based on the form
            strategy: "local",
            isTeamAccount: true,
            permissions // Assign permissions array directly
        });

        // Use passport-local-mongoose's method to register the user with password
        await User.register(newUser, password);

        // Add the new user's _id to the refAccounts array of the specified admin
        await User.findByIdAndUpdate(adminId, { $push: { refAccounts: newUser._id } });

        res.status(201).json({ message: 'User registered successfully and linked to admin.', user: newUser });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    const { id } = req.params; // Assuming you are passing user ID in params

    try {
        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
        res.status(200).json({ message: 'User deleted successfully.', user: deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
const verifyRoleForLibrary = async (req, res) => {
    const { email, password } = req.body;
    const adminId = req.params.adminId;

    try {
        // Find the user by username (email)
        const user = await User.findOne({ username: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Use passport-local-mongoose's authenticate method properly
        return new Promise((resolve, reject) => {
            user.authenticate(password, (err, authenticatedUser, passwordError) => {
                if (err) {
                    console.error("Authentication error:", err);
                    return res.status(500).json({ error: 'Authentication error occurred.' });
                }

                if (passwordError) {
                    return res.status(401).json({ error: 'Invalid password.' });
                }

                if (!authenticatedUser) {
                    return res.status(401).json({ error: 'Authentication failed.' });
                }

                // Check role and permissions
                const hasRequiredRole = authenticatedUser.role === "employee";
                const hasLibraryPermission = authenticatedUser.permissions.includes("library");

                if (!hasRequiredRole || !hasLibraryPermission) {
                    return res.status(403).json({
                        error: 'User does not have required library access permissions.',
                        details: {
                            hasRole: hasRequiredRole,
                            hasPermission: hasLibraryPermission
                        }
                    });
                }

                // Check if user is associated with the admin account
                User.findById(adminId).exec()
                    .then(admin => {
                        if (!admin) {
                            return res.status(404).json({ error: 'Admin account not found.' });
                        }

                        const isInAdminSubAccounts = admin.refAccounts.some(
                            refId => refId.toString() === authenticatedUser._id.toString()
                        );

                        if (!isInAdminSubAccounts) {
                            return res.status(403).json({
                                error: 'User is not associated with the specified admin account.'
                            });
                        }

                        // Initialize passport in session if not present
                        if (!req.session.passport) {
                            req.session.passport = {};
                        }

                        // Add new fields to existing passport user object while preserving existing data
                        req.session.passport.user = {
                            ...req.session.passport.user, // Preserve existing fields
                            libraryDetails: {  // New fields in nested object
                                libraryAccess: true,
                                role: authenticatedUser.role,
                                permissions: authenticatedUser.permissions,
                                email: authenticatedUser.username
                            }
                        };

                        // Save session
                        req.session.save((err) => {
                            if (err) {
                                console.error("Session save error:", err);
                                return res.status(500).json({ error: 'Error saving session.' });
                            }

                           
                            return res.status(200).json({
                                message: 'User verified successfully with library access.',
                                user: req.session.passport.user
                            });
                        });
                    })
                    .catch(error => {
                        console.error("Error checking admin association:", error);
                        return res.status(500).json({ error: 'Error verifying admin association.' });
                    });
            });
        });

    } catch (error) {
        console.error("Error in verifyRoleForLibrary:", error);
        return res.status(500).json({ error: "Internal server error" });
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
    fetchAllSiteUsers,
    editUserById, addUser, deleteUser,
    verifyRoleForLibrary
    // Add other controller functions as needed
};




