const  Event = require('../../models/events');
const { uploadToCloudinary } = require('../../cloudinary');
const fs = require('fs');

const addEvent = async (req, res) => {
 
    const { title, description, googleFormLink, event } = req.body;
    const image = req.file; // Assuming the image file is sent in the request

    try {
        let newEventData = {
            title,
            description,
            googleFormLink,
            event,
        };

        // If there is an image file, upload it to Cloudinary and save the URL in the newEventData object
        if (image) {
            const results = await uploadToCloudinary(image.path, "Events");

            // Save the image URL to the newEventData object
            newEventData.imageUrl = results.url;

            // Optionally, remove the file from the server after uploading
            fs.unlinkSync(image.path);
        }

        // Create a new event record with the provided data
        const newEvent = new Event(newEventData);
        await newEvent.save();

        // Respond with the newly created event data
        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const editEvent = async (req, res) => {
    const { id } = req.params; // Get event ID from request params
    const { title, description, googleFormLink, event } = req.body;
    const image = req.file; // Assuming the image file is sent in the request

    try {
        let updateData = {
            title,
            description,
            googleFormLink,
            event,
        };

        // If there is an image file, upload it to Cloudinary and save the URL in the updateData object
        if (image) {
            const results = await uploadToCloudinary(image.path, "Events");

            // Save the image URL to the updateData object
            updateData.imageUrl = results.url;

            // Optionally, remove the file from the server after uploading
            fs.unlinkSync(image.path);
        }

        // Update the event record with the new data
        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Respond with the updated event data
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


const deleteEvent = async (req, res) => {
    const { id } = req.params; // Get event ID from request params

    try {
        // Find the event by ID and remove it from the database
        const deletedEvent = await Event.findByIdAndDelete(id);

        if (!deletedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Respond with a success message
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Error deleting event:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getEvents = async (req, res) => {
    try {
        // Fetch all events from the database
        const events = await Event.find();
        // Respond with the events data
        console.log(events)
        res.status(200).json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Export controller functions
module.exports = {
    addEvent,
    editEvent,
    deleteEvent,
    getEvents
    // Add other controller functions as needed
};
