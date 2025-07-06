const Event = require("../../models/events");
const { uploadToCloudinary } = require('../../config/cloudinary');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const addEvent = async (req, res) => {
    const { title, description, googleFormLink,endDate, image } = req.body;

    try {
        let newEventData = {
            title,
            description,
            googleFormLink,
           endDate
        };

        // If there is an image file, upload it to Cloudinary and save the URL and public ID
        if (image) {
            const result = await uploadToCloudinary(image, "Events");

            // Save the image URL and public ID to the newEventData object
            newEventData.image = {
                url: result.url,
                publicId: result.publicId
            };
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
    const { title, description, googleFormLink, image, endDate } = req.body;
     // Assuming the image file is sent in the request

    try {
        // Find the current event
        const currentEvent = await Event.findById(id);

        if (!currentEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        let updateData = {
            title,
            description,
            googleFormLink,
            endDate
        };

        // If there is an image file, handle the image update
        if (image) {
            // Delete the old image from Cloudinary if it exists
            if (currentEvent.image && currentEvent.image.publicId) {
                await cloudinary.uploader.destroy(currentEvent.image.publicId);
            }

            // Upload the new image to Cloudinary
            const result = await uploadToCloudinary(image, "Events");

            // Save the new image URL and public ID to the updateData object
            updateData.image = {
                url: result.url,
                publicId:result.publicId
            };

            // Optionally, remove the file from the server after uploading
          
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
        // Find the event by ID
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ error: "Event not found" });
        }

        // Delete image from Cloudinary if it exists
        if (event.image && event.image.publicId) {
            await cloudinary.uploader.destroy(event.image.publicId);
        }

        // Delete the event from the database
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
