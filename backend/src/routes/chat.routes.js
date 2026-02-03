const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const protect = require('../middleware/auth');

router.post('/initiate', protect, chatController.initiateChat);
router.get('/my-chats', protect, chatController.getUserChats);
router.get('/:chatId/messages', protect, chatController.getChatMessages);

module.exports = router;
