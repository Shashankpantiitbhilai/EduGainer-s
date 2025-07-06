
const { uploadToCloudinary } = require("../../../config/cloudinary")
const fs = require('fs/promises');
const vision = require('@google-cloud/vision');
const path = require('path');

const { Face } = require("../../../models/face");
const {User}=require("../../../models/student")

// Initialize Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient();

const addEmployee = async (req, res) => {
    try {
        const adminId = req.params.adminId;
        console.log("add employee", req.body, req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Face photo is required' });
        }

        const imagePath = path.resolve(req.file.path);
        const imageContent = await fs.readFile(imagePath);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.path, "EduGainer's Team");
        const imageUrl = cloudinaryResult.url;
        const public_id = cloudinaryResult.publicId;

        let existingUser = await User.findOne({ username: req.body.email });

        if (existingUser) {
            const updateData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                bio: req.body.bio,
                role: req.body.role,
                photoUpload: imageUrl,
                phoneNumber: req.body.phoneNumber,
                department: req.body.department,
                isTeamAccount: req.body.isTeamAccount === 'true',
                faceAuthEnabled: req.body.faceAuthEnabled === 'true',
                permissions: req.body.permissions
            };

            existingUser = await User.findOneAndUpdate(
                { username: req.body.email },
                { $set: updateData, $addToSet: { refAccounts: adminId } },
                { new: true }
            );

            return res.status(200).json({
                message: 'Employee details updated successfully.',
                user: existingUser
            });

        } else {
            const newUser = new User({
                strategy: 'local',
                username: req.body.email,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                bio: req.body.bio,
                role: req.body.role,
                photoUpload: imageUrl,
                phoneNumber: req.body.phoneNumber,
                department: req.body.department,
                isTeamAccount: req.body.isTeamAccount === 'true',
                faceAuthEnabled: req.body.faceAuthEnabled === 'true',
                permissions: req.body.permissions
            });

            await User.register(newUser, req.body.password);
            const savedUser = await newUser.save();

            const faceData = new Face({
                userId: savedUser._id,
                referenceImage: {
                    url: imageUrl,
                    publicId: public_id,
                    uploadedAt: new Date()
                }
            });

            const savedFaceData = await faceData.save();

            savedUser.faceData = savedFaceData._id;
            await savedUser.save();

            const updatedAdmin = await User.findByIdAndUpdate(
                adminId,
                { $push: { refAccounts: savedUser._id } },
                { new: true }
            );

            return res.status(201).json({
                message: 'Employee added successfully and linked to admin.',
                user: savedUser,
                faceData: savedFaceData,
                updatedAdmin
            });
        }
    } catch (error) {
        console.error('Error adding employee:', error);
        return res.status(500).json({
            error: 'Error adding employee',
            details: error.message
        });
    }
};


// Assuming Face model is in this path

const fetchTeamAccounts = async (req, res) => {
    try {
        // Find users with isTeamAccount set to true
        const teamAccounts = await User.find({ isTeamAccount: true })
            .populate({
                path: 'faceData',
                select: 'referenceImage.url', // Select specific fields from Face
            });

        // Map through each team account and format the response
        const response = teamAccounts.map(user => ({
            _id: user._id,
            strategy: user.strategy,
            googleId: user.googleId,
            username:user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            bio: user.bio,
            photoUpload: user.photoUpload,
            role: user.role,
            status: user.status,
            refAccounts: user.refAccounts,
            isTeamAccount: user.isTeamAccount,
            permissions: user.permissions,
            faceAuthEnabled: user.faceAuthEnabled,
            lastFaceAuth: user.lastFaceAuth,
            phoneNumber: user.phoneNumber,
            department: user.department,
            startDate: user.startDate,
            endDate: user.endDate,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            faceData: user.faceData ? {
                url: user.faceData.referenceImage.url,

            } : null // If faceData is null, handle gracefully
        }));
console.log(response);
        res.status(200).json({
            message: 'Team accounts fetched successfully',
            data: response
        });

    } catch (error) {
        console.error('Error fetching team accounts:', error);
        res.status(500).json({
            error: 'Error fetching team accounts',
            details: error.message
        });
    }
};
const addUser = async (req, res) => {
    const { email, password, firstName, lastName, role, permissions } = req.body;
    const adminId = req.params.adminId; // ID of the admin document to update


    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username: email });
        if (existingUser) {
            console.log("User already exists with this email:", email);
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

        // Register the new user with the provided password
        await User.register(newUser, password);


        // Check if the admin exists
        const adminUser = await User.findById(adminId);
        if (!adminUser) {
            console.log("Admin not found with ID:", adminId);
            return res.status(404).json({ error: 'Admin account not found.' });
        }

        // Add the new user's _id to the refAccounts array of the specified admin
        const updatedAdmin = await User.findByIdAndUpdate(
            adminId,
            { $push: { refAccounts: newUser._id } },
            { new: true } // Return the updated document
        );
        console.log("Updated Admin's refAccounts:", updatedAdmin.refAccounts);

        res.status(201).json({
            message: 'User registered successfully and linked to admin.',
            user: newUser
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const deleteUser = async (req, res) => {
    const { id } = req.params; // User ID to be deleted
console.log("deleting")
    try {
        // Find and delete the user by ID
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }
console.log("deleting")
        // Remove the deleted user from the admin's refAccounts array
        const adminId = process.env.adminId;
        const updatedAdmin = await User.findByIdAndUpdate(
            adminId,
            { $pull: { refAccounts: id } },
            { new: true } // Return the updated document
        );

        // Check if the admin update was successful
        if (!updatedAdmin) {
            console.warn("Admin not found with ID:", adminId);
            return res.status(404).json({ error: 'Admin account not found.' });
        }

        res.status(200).json({
            message: 'User deleted successfully and removed from admin’s refAccounts.',
            user: deletedUser
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const verifyRoleForLibrary = async (req, res) => {
    const { email, password } = req.body;
    const adminId = process.env.adminId;
    console.log(req.body)
    try {
        // Find the user by username (email)
        const user = await User.findOne({ username: email });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Use passport-local-mongoose's authenticate method properly
        return new Promise((resolve, reject) => {
            user.authenticate(password, (err, authenticatedUser, passwordError) => {
                console.log(authenticatedUser, "auth")
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
                    console.log("error")
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

                        // Store only currentUser with email and permissions
                        req.session.passport.user = {
                            ...req.session.passport.user, // Preserve existing fields
                            currentUser: {  // Only store email and permissions
                                username: authenticatedUser.username,
                                permissions: authenticatedUser.permissions,
                                role: "employee"
                            }
                        };

                        // Save session
                        req.session.save((err) => {
                            if (err) {
                                console.error("Session save error:", err);
                                return res.status(500).json({ error: 'Error saving session.' });
                            }
                            console.log(req.session.passport.user.currentUser, "curr")
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



module.exports = {
    addEmployee,fetchTeamAccounts,verifyRoleForLibrary,deleteUser
}