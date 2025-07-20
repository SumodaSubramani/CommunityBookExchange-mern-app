const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  
  // --- THIS IS THE NEW, MORE DETAILED STATUS FIELD ---
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'sent', 'received'], 
    default: 'pending' 
  },
  
  isRatedByOwner: { type: Boolean, default: false },
  isRatedByRequester: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Request', requestSchema);