// backend/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const Request = require('../models/Request');

// Get or create a conversation for a specific request
router.get('/request/:requestId', auth, async (req, res) => {
  try {
    let conversation = await Conversation.findOne({ request_id: req.params.requestId });
    if (!conversation) {
      const request = await Request.findById(req.params.requestId);
      if (!request) return res.status(404).json({ message: 'Request not found' });
      
      conversation = new Conversation({
        request_id: req.params.requestId,
        participants: [request.ownerId, request.requesterId],
      });
      await conversation.save();
    }
    res.json(conversation);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get all messages for a specific conversation
router.get('/conversation/:conversationId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId })
      .populate('senderId', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;