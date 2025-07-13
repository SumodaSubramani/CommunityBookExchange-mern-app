const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');

// @route   POST api/requests
// @desc    Create a new book request
router.post('/', auth, async (req, res) => {
    const { bookId } = req.body;
    try {
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.userId.toString() === req.userId) return res.status(400).json({ message: 'You cannot request your own book' });
        
        const existingRequest = await Request.findOne({ bookId, requesterId: req.userId });
        if (existingRequest) return res.status(400).json({ message: 'You have already requested this book' });

        const request = new Request({ bookId, requesterId: req.userId, ownerId: book.userId });
        await request.save();
        res.status(201).json(request);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// @route   GET api/requests
// @desc    Get all requests for the logged-in user (incoming and outgoing)
router.get('/', auth, async (req, res) => {
    try {
        const requests = await Request.find({ $or: [{ requesterId: req.userId }, { ownerId: req.userId }] })
            .populate('bookId', 'title') // Populate book details
            .populate('requesterId', 'username') // Populate requester's username
            .populate('ownerId', 'username'); // Populate owner's username
        res.json(requests);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// @route   PUT api/requests/:id
// @desc    Update a request's status (accept/reject)
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        
        // Only the book owner can accept or reject a request
        if (request.ownerId.toString() !== req.userId) {
            return res.status(403).json({ message: 'User not authorized' });
        }
        
        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// @route   POST api/requests/:id/deliver
// @desc    Mark a request as delivered and update the book's status
router.post('/:id/deliver', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);

    // 1. Validate the request
    if (!request) {
      return res.status(404).json({ msg: 'Request not found' });
    }
    // Only the book owner can mark it as delivered
    if (request.ownerId.toString() !== req.userId) {
      return res.status(401).json({ msg: 'User not authorized' });
    }
    // Can only be delivered if it was accepted first
    if (request.status !== 'accepted') {
      return res.status(400).json({ msg: 'Cannot deliver a request that is not accepted.' });
    }
    if (request.isDelivered) {
      return res.status(400).json({ msg: 'This request has already been marked as delivered.' });
    }

    // 2. Update the request status
    request.isDelivered = true;
    await request.save();

    // 3. Update the book status to 'exchanged' so it no longer appears in browse
    await Book.findByIdAndUpdate(request.bookId, { status: 'exchanged' });

    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/requests/:id/contact
// @desc    Get contact info for an approved request
router.get('/:id/contact', auth, async (req, res) => {
    try {
        // Populate the full user objects for both owner and requester
        const request = await Request.findById(req.params.id).populate('ownerId requesterId');
        if (!request) return res.status(404).json({ message: 'Request not found' });

        // Verify the current user is part of this transaction
        const isOwner = request.ownerId._id.toString() === req.userId;
        const isRequester = request.requesterId._id.toString() === req.userId;

        // Only share contact info if the request is accepted and the user is involved
        if (request.status === 'accepted' && (isOwner || isRequester)) {
            
            const contactInfo = {
                owner: { 
                    _id: request.ownerId._id, 
                    username: request.ownerId.username, 
                    email: request.ownerId.email, 
                    phone: request.ownerId.phone 
                },
                requester: { 
                    _id: request.requesterId._id, 
                    username: request.requesterId.username, 
                    email: request.requesterId.email, 
                    phone: request.requesterId.phone 
                }
            };
            return res.json(contactInfo);
        }

        res.status(403).json({ message: 'Access denied or request not accepted' });
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

module.exports = router;