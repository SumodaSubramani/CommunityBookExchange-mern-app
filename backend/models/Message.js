// backend/models/Message.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);