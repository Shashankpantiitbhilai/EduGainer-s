// Import necessary modules and models
const { ColorLegend } = require("../../models/color-legend"); // Adjust path as per your project structure

// Controller function to handle saving a legend
const getLegends = async (req, res) => {


    try {

        // Check if the legend with the same name already exists
        const existingLegend = await ColorLegend.find();

        // console.log(existingLegend)


        // Return success response
        res.status(201).json({ message: "Legend saved successfully.", legends: existingLegend });
    } catch (error) {
        console.error("Error saving legend:", error);
        res.status(500).json({ message: "Failed to save legend." });
    }
};


const addLegend = async (req, res) => {
    const { name, colorCode } = req.body;
    // console.log(req.body)
    try {
        // console.log(name, colorCode)
        // Validate incoming data (optional depending on your needs)
        if (!name || !colorCode) {
            return res.status(400).json({ message: "Name and color are required." });
        }

        // Check if the legend with the same name already exists
        const existingLegend = await ColorLegend.findOne({ name });
        if (existingLegend) {
            return res.status(400).json({ message: "Legend with this name already exists." });
        }

        // Create new legend instance
        const newLegend = new ColorLegend({ name, colorCode });

        // Save legend to database
        await newLegend.save();

        // Return success response
        res.status(201).json({ message: "Legend saved successfully.", legend: newLegend });
    } catch (error) {
        console.error("Error saving legend:", error);
        res.status(500).json({ message: "Failed to save legend." });
    }
};



const deleteLegend = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate incoming data (optional depending on your needs)
        
// console.log("delete",id)
        // Delete the legend from database
        await ColorLegend.findByIdAndDelete(id);

        // Return success response
        res.status(200).json({ message: "Legend deleted successfully." });
    } catch (error) {
        console.error("Error deleting legend:", error);
        res.status(500).json({ message: "Failed to delete legend." });
    }
};



module.exports = { addLegend, getLegends ,deleteLegend};
