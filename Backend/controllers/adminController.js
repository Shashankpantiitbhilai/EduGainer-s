// Assuming you have an Student model
const { Student } = require('../models/student'); // Assuming you have a Shift model

// Example function to search Students by shift
const searchStudentsByShift = async (req, res) => {
    const { shift } = req.query;// Assuming shift is sent in the request body
    try {
        // Query database to find admins based on the shift
        let students=[]
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

// Export controller functions
module.exports = {
    searchStudentsByShift,
    // Add other controller functions as needed
};
