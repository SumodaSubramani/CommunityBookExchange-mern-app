const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
  const { username, email, password, phone, city, state } = req.body;
  if (!username || !email || !password || !phone || !city || !state) {
    return res.status(400).json({ message: 'Please enter all fields' });
  }
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword, phone, city, state });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) { res.status(500).send('Server error'); }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user.id, username: user.username };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '3h' });
    res.json({ token });
  } catch (err) { res.status(500).send('Server error'); }
});

module.exports = router;