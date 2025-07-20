const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/authMiddleware');
const { uploadToCloudinary } = require('../config/cloudinary');

// ... POST and DELETE routes remain the same ...
router.post('/', auth, uploadToCloudinary, async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Book cover image is required.' });
  const { title, author, condition, type, price, city, state } = req.body;
  if (type === 'sell' && (!price || price <= 0)) return res.status(400).json({ message: 'Price is required for selling a book.' });
  try {
    const newBookData = { title, author, condition, type, price: type === 'sell' ? price : 0, city, state, userId: req.userId, imageUrl: req.file.path };
    const newBook = new Book(newBookData);
    const book = await newBook.save();
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// GET route for public browsing - WITH DETAILED LOGGING
router.get('/', async (req, res) => {
  console.log('[BACKEND-INFO] /api/books GET route hit.'); // DEBUG 1
  try {
    const { city, state } = req.query;
    console.log(`[BACKEND-INFO] Query params received: city=${city}, state=${state}`); // DEBUG 2

    const filter = { status: 'available' };
    if (city) filter.city = new RegExp(city, 'i');
    if (state) filter.state = new RegExp(state, 'i');
    
    console.log('[BACKEND-INFO] Using filter to find books:', filter); // DEBUG 3

    const books = await Book.find(filter).populate('userId', 'username ratings');
    
    console.log(`[BACKEND-INFO] Found ${books.length} books.`); // DEBUG 4

    // DEBUG 5: Log the first book if it exists to check its structure
    if (books.length > 0) {
      console.log('[BACKEND-INFO] Sample book data being sent:', JSON.stringify(books[0], null, 2));
    }
    
    res.json(books);

  } catch (err) { 
    console.error('[BACKEND-ERROR] CRASH in /api/books GET route:', err); // DEBUG 6
    res.status(500).send('Server Error'); 
  }
});

// ... my-books and delete routes  ...
router.get('/my-books', auth, async (req, res) => {
  try {
    const books = await Book.find({ userId: req.userId });
    res.json(books);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.userId.toString() !== req.userId) return res.status(401).json({ msg: 'User not authorized' });
    await Book.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Book removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;