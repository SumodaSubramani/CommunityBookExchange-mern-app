const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Used'],
    required: true,
  },
  type: { type: String, enum: ['sell', 'lend'], required: true },
  price: { type: Number, default: 0 },
  city: { type: String, required: true },
  state: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },

  status: { type: String, enum: ['available', 'exchanged'], default: 'available' },
});

module.exports = mongoose.model('Book', bookSchema);