const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RatingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },

  // --- NEW FIELDS ---
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Book' }],
  ratings: [RatingSchema],
});

// Add a virtual property to calculate the average rating
userSchema.virtual('averageRating').get(function() {
    if (!this.ratings ||this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
    return (sum / this.ratings.length).toFixed(1);
});

// Ensure virtuals are included when converting to JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);