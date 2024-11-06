const fs = require("fs").promises;
const path = require("path");
const vision = require('@google-cloud/vision');
const { User } = require("../../models/student");
const { Face } = require("../../models/face");
const { uploadToCloudinary } = require("../../cloudinary");

// Initialize Cloud Vision client
const visionClient = new vision.ImageAnnotatorClient();

const addEmployee = async (req, res) => {
    try {
        const adminId = req.params.adminId;  // ID of the admin to update
        console.log("face-detec", req.body, req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Face photo is required' });
        }

        // Read the image from disk
        const imagePath = path.resolve(req.file.path);
        const imageContent = await fs.readFile(imagePath);

        // Analyze face using Cloud Vision API
        const [result] = await visionClient.faceDetection({
            image: { content: imageContent.toString("base64") }
        });

        const faces = result.faceAnnotations;
        if (!faces || faces.length === 0) {
            return res.status(400).json({ error: 'No face detected in the image' });
        }
        if (faces.length > 1) {
            return res.status(400).json({ error: 'Multiple faces detected. Please upload a photo with a single face' });
        }

        // Upload the image to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(req.file.path, "Library_Students");
        const imageUrl = cloudinaryResult.url;

        // Create new user
        const newUser = new User({
            strategy: 'local',
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address: req.body.address,
            bio: req.body.bio,
            role: 'employee',
            photoUpload: imageUrl,
            faceAuthEnabled: true,
            ...req.body
        });

        const savedUser = await newUser.save();

        // Create face data entry
        const faceData = new Face({
            userId: savedUser._id,
            landmarks: faces[0].landmarks.map(landmark => ({
                type: landmark.type,
                position: {
                    x: landmark.position.x,
                    y: landmark.position.y,
                    z: landmark.position.z
                }
            })),
            faceAngles: {
                rollAngle: faces[0].rollAngle,
                panAngle: faces[0].panAngle,
                tiltAngle: faces[0].tiltAngle
            },
            boundingBox: {
                left: faces[0].boundingPoly.vertices[0].x,
                top: faces[0].boundingPoly.vertices[0].y,
                width: faces[0].boundingPoly.vertices[2].x - faces[0].boundingPoly.vertices[0].x,
                height: faces[0].boundingPoly.vertices[2].y - faces[0].boundingPoly.vertices[0].y
            },
            confidence: faces[0].detectionConfidence,
            referenceImage: {
                url: imageUrl,
                uploadedAt: new Date()
            }
        });

        const savedFaceData = await faceData.save();

        // Update user with face data reference
        savedUser.faceData = savedFaceData._id;
        await savedUser.save();

        // Update the admin's refAccounts array with the new employee's ID
        const updatedAdmin = await User.findByIdAndUpdate(
            adminId,
            { $push: { refAccounts: savedUser._id } },
            { new: true }
        );

        res.status(201).json({
            message: 'Employee added successfully and linked to admin.',
            user: savedUser,
            faceData: savedFaceData,
            updatedAdmin
        });

    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({
            error: 'Error adding employee',
            details: error.message
        });
    }
};

module.exports = { addEmployee };
