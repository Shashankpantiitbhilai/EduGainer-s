
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

        // console.log(req.body, messages);

        try {
            const newMessage = await Message.create({ messages, user });
            await newMessage.save();

            // Emit the message to all connected clients
        //    var roomId = `${messages[0].sender} - ${messages[0].receiver}`;
        //     console.log(roomId)
            // io.to(roomId).emit('receiveMessage', messageData);
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

    return {
        fetchChatMessages,
        postChatMessages,
        fetchAdminCredentials,

    };
};
