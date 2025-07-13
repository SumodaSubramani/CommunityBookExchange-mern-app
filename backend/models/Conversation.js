// backend/models/Conversation.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConversationSchema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  request_id: { type: Schema.Types.ObjectId, ref: 'Request', required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Conversation', ConversationSchema);