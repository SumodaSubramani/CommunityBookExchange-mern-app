const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');

// POST /api/requests
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

// GET /api/requests
router.get('/', auth, async (req, res) => {
    try {
        const requests = await Request.find({ $or: [{ requesterId: req.userId }, { ownerId: req.userId }] })
        .sort({ createdAt: -1 }) // -1 means descending order (newest first)    
        .populate('bookId', 'title')
            .populate('requesterId', '_id username') // Ensure _id is populated
            .populate('ownerId', '_id username');     // Ensure _id is populated
        res.json(requests);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// PUT /api/requests/:id
router.put('/:id', auth, async (req, res) => {
    const { status } = req.body;
    try {
        let request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: 'Request not found' });
        if (request.ownerId.toString() !== req.userId) return res.status(403).json({ message: 'User not authorized' });
        request.status = status;
        await request.save();
        res.json(request);
    } catch (err) { 
        console.error(err.message);
        res.status(500).send('Server Error'); 
    }
});

// POST /api/requests/:id/deliver
router.post('/:id/deliver', auth, async (req, res) => {
  try {
    let request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });
    if (request.requesterId.toString() !== req.userId) return res.status(401).json({ msg: 'User not authorized' });
    if (request.status !== 'accepted') return res.status(400).json({ msg: 'Cannot confirm receipt for a request that is not accepted.' });
    if (request.isDelivered) return res.status(400).json({ msg: 'This request has already been marked as received.' });
    request.isDelivered = true;
    await request.save();
    await Book.findByIdAndUpdate(request.bookId, { status: 'exchanged' });
    res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW ROUTE 1: Mark as SENT (by the Owner) ---
router.post('/:id/sent', auth, async (req, res) => {
    try {
      let request = await Request.findById(req.params.id);
      if (!request) return res.status(404).json({ msg: 'Request not found' });
  
      // Only the book OWNER can mark it as sent
      if (request.ownerId.toString() !== req.userId) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      if (request.status !== 'accepted') return res.status(400).json({ msg: 'Request not accepted' });
  
      request.deliveryStatus = 'sent';
      await request.save();
      res.json(request);
    } catch (err) { res.status(500).send('Server Error'); }
  });
  
  // --- NEW ROUTE 2: Mark as RECEIVED (by the Requester) ---
  router.post('/:id/receive', auth, async (req, res) => {
    try {
      let request = await Request.findById(req.params.id);
      if (!request) return res.status(404).json({ msg: 'Request not found' });
  
      // Only the book REQUESTER can mark it as received
      if (request.requesterId.toString() !== req.userId) {
        return res.status(401).json({ msg: 'User not authorized' });
      }
      // Can only be received if it has been marked as sent first
      if (request.deliveryStatus !== 'sent') return res.status(400).json({ msg: 'Book has not been marked as sent by the owner yet.' });
  
      // Update the request and the book status
      request.deliveryStatus = 'received';
      await request.save();
      await Book.findByIdAndUpdate(request.bookId, { status: 'exchanged' });
  
      res.json(request);
    } catch (err) { res.status(500).send('Server Error'); }
  });
  

// GET /api/requests/:id/contact
router.get('/:id/contact', auth, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id).populate('ownerId requesterId');
        if (!request) return res.status(404).json({ message: 'Request not found' });
        const isOwner = request.ownerId._id.toString() === req.userId;
        const isRequester = request.requesterId._id.toString() === req.userId;
        if (request.status === 'accepted' && (isOwner || isRequester)) {
            const contactInfo = {
                owner: { _id: request.ownerId._id, username: request.ownerId.username, email: request.ownerId.email, phone: request.ownerId.phone },
                requester: { _id: request.requesterId._id, username: request.requesterId.username, email: request.requesterId.email, phone: request.requesterId.phone }
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