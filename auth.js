const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const sendMail = require('../utils/mailer'); // 📨 Email utility

// User Signup Route
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // 📨 Send welcome email
    try {
      await sendMail(
        email,
        'Welcome to Secret Coders 🎉',
        `<h2>Hello ${name},</h2>
        <p>Thank you for signing up with <strong>Secret Coders</strong>!</p>
        <p>We’re thrilled to have you on board. 🎯</p>
        <p>Happy Learning!<br/>Team Secret Coders</p>`
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // Optional: you can still proceed if email fails
    }

    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
