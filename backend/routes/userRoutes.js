// backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const Request = require('../models/Request'); // Needed for rating logic
const Book = require('../models/Book');     // Needed for wishlist logic

// --- WISHLIST ROUTES ---

// @route   GET /api/user/wishlist
router.get('/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate({
            path: 'wishlist',
            populate: { path: 'userId', select: 'username' }
        });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/user/wishlist/:bookId
router.post('/wishlist/:bookId', auth, async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        await User.findByIdAndUpdate(req.userId, { $addToSet: { wishlist: req.params.bookId } });
        res.status(200).json({ message: 'Book added to wishlist' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/user/wishlist/:bookId
router.delete('/wishlist/:bookId', auth, async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.userId, { $pull: { wishlist: req.params.bookId } });
        res.status(200).json({ message: 'Book removed from wishlist' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


// --- PROFILE & RATING ROUTES ---

// @route   GET /api/user/profile
// @desc    Get the logged-in user's own profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .select('-password')
            .populate('ratings.user', 'username');
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.ratings) {
            user.ratings.sort((a, b) => b.createdAt - a.createdAt); // Newest first
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/user/profile
// @desc    Update the logged-in user's profile information
router.put('/profile', auth, async (req, res) => {
    const { username, phone, city, state } = req.body;
    const profileFields = {};
    if (username) profileFields.username = username;
    if (phone) profileFields.phone = phone;
    if (city) profileFields.city = city;
    if (state) profileFields.state = state;
    try {
        let user = await User.findByIdAndUpdate(
            req.userId,
            { $set: profileFields },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error("Profile Update Error:", err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET /api/user/ratings/given
// @desc    Get all ratings a user has GIVEN to others
router.get('/ratings/given', auth, async (req, res) => {
    try {
        const usersRatedByMe = await User.find({ 'ratings.user': req.userId }).select('username ratings');
        const myGivenRatings = usersRatedByMe.flatMap(user => { // Use flatMap for cleaner structure
            return user.ratings
                .filter(r => r.user.equals(req.userId))
                .map(myRating => ({
                    ratedUser: { _id: user._id, username: user.username },
                    rating: myRating.rating,
                    comment: myRating.comment,
                    createdAt: myRating.createdAt, // Make sure to include createdAt
                    _id: myRating._id
                }));
        });
        
        // --- NEW: Sort the final array of ratings ---
        myGivenRatings.sort((a, b) => b.createdAt - a.createdAt); // Newest first

        res.json(myGivenRatings);
    } catch (err) {
        console.error("Get Given Ratings Error:", err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST /api/user/rate/:userId
// @desc    Submit a rating for another user
router.post('/rate/:userId', auth, async (req, res) => {
    const { rating, comment, requestId } = req.body;
    if (!rating || !requestId) return res.status(400).json({ message: 'Rating and Request ID are required.' });

    try {
        const userToRate = await User.findById(req.params.userId);
        if (!userToRate) return res.status(404).json({ message: 'User to rate not found' });
        
        const request = await Request.findById(requestId);
        if (!request) return res.status(404).json({ message: 'Associated request not found.' });

        // Add the rating to the user's profile
        const newRating = { user: req.userId, rating, comment };
        // Avoid duplicate ratings from the same user on the same transaction, update if exists
        const existingRatingIndex = userToRate.ratings.findIndex(r => r.user.equals(req.userId) && request._id.equals(r.requestId));
        if (existingRatingIndex > -1) {
            userToRate.ratings[existingRatingIndex] = newRating;
        } else {
            userToRate.ratings.push(newRating);
        }
        await userToRate.save();

        // --- NEW LOGIC: Update the correct isRated flag ---
        const isRaterTheOwner = request.ownerId.equals(req.userId);
        if (isRaterTheOwner) {
            request.isRatedByOwner = true;
        } else {
            request.isRatedByRequester = true;
        }
        await request.save();

        res.json({ message: "Rating submitted successfully" });
    } catch (err) {
        console.error("POST Rating Error:", err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;