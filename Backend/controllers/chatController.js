
const { Message } = require("../models/chat");


const { User } = require("../models/student")
module.exports = (io) => {
    const fetchChatMessages = async (req, res) => {
        try {

            const messages = await Message.find({ user: req.user._id });

            // console.log("messages hi reached fetchchat rouyte",messages);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        // console.log("reaches chat messages", req.user);
    };

    const postChatMessages = async (req, res) => {
        const { messages, user } = req.body;



        try {
            const newMessage = await Message.create({ messages, user });
         
            await newMessage.save();


            res.status(201).json(newMessage);
        } catch (err) {
            res.status(500).send(err);
        }
    };
    const fetchAdminCredentials = async (req, res) => {

        try {
            const admin_data = await User.find({ role: "admin" })
            // Emit the message to all connected clients
            // console.log("admin", admin_data)

            res.status(201).json(admin_data);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    const makeAllMessagesSeen = async (req, res) => {
        try {
            const userId = req.body.userRoomId; // Get userRoomId from request body

            // Update all messages for the user where seen is false
            const updatedMessages = await Message.updateMany(
                { user: userId, "messages.seen": false },
                { $set: { "messages.$[].seen": true } } // Set seen to true for all messages
            );

            // Check if messages were updated
            if (updatedMessages.modifiedCount > 0) {
                return res.status(200).json({ message: "All messages marked as seen." });
            } else {
                return res.status(404).json({ message: "No unseen messages found." });
            }
        } catch (error) {
            console.error("Error marking messages as seen:", error);
            res.status(500).json({ message: error.message });
        }
    };

    const findUnseenMessages = async (req, res) => {
        try {
            const userId = req.user?._id; // Get user ID from the authenticated request


            // Find unseen messages for users other than the current user
            const unseenMessages = await Message.find({
                $and: [
                    {
                        $or: [
                            { "messages.receiver": userId },  // Receiver is the specific user
                            { "messages.receiver": "All" }   // OR receiver is "All"
                        ]
                    },
                    { "messages.seen": false }               // Only get unseen messages
                ]
            });


            res.status(200).json(unseenMessages);
        } catch (error) {
            console.error("Error fetching unseen messages:", error);
            res.status(500).json({ message: error.message });
        }
    };
    const updateMessageSeenStatus = async (req, res) => {
        const { userId } = req.body; // Assuming userId is sent in the request body


        try {
            // Find all messages for the specified user
            const foundMessages = await Message.find({ user: userId });


            // Update all messages for a specific user by setting seen to true
            const result = await Message.updateMany(
                { user: userId }, // Find all documents where user is userId
                { $set: { "messages.$[].seen": true } } // Set seen to true for each message in the array
            );



            // Check if any messages were updated

            return res.status(200).json({ message: "All messages for the user have been marked as seen." });

        } catch (error) {
            console.error("Error updating message seen status:", error);
            return res.status(500).json({ message: "An error occurred while updating the message status." });
        }
    };

    return {
        fetchChatMessages,
        postChatMessages,
        fetchAdminCredentials,
        makeAllMessagesSeen,
        findUnseenMessages,
        updateMessageSeenStatus // Expose the new function
    };


};
