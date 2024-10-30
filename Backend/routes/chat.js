const express = require('express');

const router = express.Router();

module.exports = (io) => {
    const chatController = require('../controllers/chatController')(io);

    router.get('/fetchChatMessages', chatController.fetchChatMessages);
    router.get('/findUnseenMessage', chatController.findUnseenMessages);

    router.post('/postChatMessages', chatController.postChatMessages);
    router.get('/fetchAdminCredentials', chatController.fetchAdminCredentials);

    router.post("/makeAllMessagesSeen", chatController.makeAllMessagesSeen); 
    router.patch("/updateSeenMessage", chatController.updateMessageSeenStatus);
    return router;
};
