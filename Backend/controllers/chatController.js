const { Message } = require("../models/chat");


const { User } = require("../models/student")
module.exports = (io) => {
    const fetchChatMessages = async (req, res) => {
        try {
            console.log(req.user._id);
            const messages = await Message.find({ id: req.user._id });
            console.log(messages);
            res.json(messages);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
        console.log("reaches chat messages", req.user);
    };

    const postChatMessages = async (req, res) => {
        const { messages,user } = req.body;

        console.log(req.body, messages);

        try {
            const newMessage = await Message.create({messages,user });
            await newMessage.save();

            // Emit the message to all connected clients
            io.emit('receiveMessage', newMessage);

            res.status(201).json(newMessage);
        } catch (err) {
            res.status(500).send(err);
        }
    };
    const fetchAdminCredentials = async (req, res) => {

        try {
            const admin_data = await User.find({ role: "admin" })
            // Emit the message to all connected clients
            console.log("admin", admin_data)

            res.status(201).json(admin_data);
        } catch (err) {
            res.status(500).send(err);
        }
    };

    return {
        fetchChatMessages,
        postChatMessages,
        fetchAdminCredentials
    };
};
