const express = require('express');
const router = express.Router();
const {
  getConversations,
  startConversation,
  getMessages,
  sendMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getConversations);
router.post('/', protect, startConversation);
router.get('/:id/messages', protect, getMessages);
router.post('/:id/messages', protect, sendMessage);

module.exports = router;
