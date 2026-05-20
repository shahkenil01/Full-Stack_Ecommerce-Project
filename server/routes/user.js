const { User } = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const sendOTPEmail = require('../utils/sendOTP');
const { OAuth2Client } = require("google-auth-library");
const OtpRecord = require('../models/OtpRecord');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/check-email', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ msg: 'Invalid email' });
  }

  const existingUser = await User.findOne({
    email: email.trim().toLowerCase()
  });

  if (existingUser) {
    return res.status(400).json({ msg: 'User already exists' });
  }

  return res.status(200).json({ msg: 'Email is available' });
});

// POST SignUp
router.post('/signup', async (req, res) => {
  const { name, phone, email, password } = req.body;

  const record = await OtpRecord.findOne({ email });

  if (!record || !record.verified) {
    return res.status(403).json({ msg: "OTP not verified" });
  }

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!phone) missingFields.push("phone");

  if (missingFields.length > 0) {
    return res.status(400).json({
      msg: `Please fill: ${missingFields.join(', ')}`
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exist" });
    }

    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ msg: "Phone number already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      phone,
      email,
      password: hashPassword,
      role: 'client'
    });

    const token = jwt.sign(
      { email: result.email, id: result._id.toString(), role: result.role },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: '1h' }
    );

    // ✅ Fix — signup ke baad OTP record DB se delete karo
    await OtpRecord.deleteOne({ email });

    res.status(200).json({ success: true, user: result, token });

  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(400).json({ msg: "Email already exists" });
      }
      if (error.keyPattern?.phone) {
        return res.status(400).json({ msg: "Phone number already exists" });
      }
    }
    res.status(500).json({ msg: "Something went wrong" });
  }
});

// POST SignIn
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  const missing = [];
  if (!email) missing.push('email');
  if (!password) missing.push('password');

  if (missing.length > 0) {
    return res.status(400).json({ msg: `Please fill: ${missing.join(', ')}` });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found. Please SignUp." });
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const userCart = await Cart.find({ userEmail: existingUser.email });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id.toString(), role: existingUser.role },
      process.env.JSON_WEB_TOKEN_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      user: existingUser,
      cart: userCart,
      token,
      msg: "user Authenticated"
    });

  } catch (error) {
    res.status(500).json({ msg: "somthing went wrong" });
  }
});

// Clear Cart
router.delete('/clear-cart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const result = await Cart.deleteMany({ userEmail: user.email });

    return res.status(200).json({
      msg: "Cart cleared",
      deleted: result.deletedCount
    });

  } catch (error) {
    return res.status(400).json({
      msg: "Failed to clear cart",
      error: error.message
    });
  }
});

// Get All Users
router.get('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const userList = await User.find();
    if (userList.length === 0) {
      return res.status(404).json({ msg: 'No users found' });
    }
    return res.status(200).json(userList);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Protected Route
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
  }
});

// Request OTP
router.post('/request-otp', async (req, res) => {
  const { email, type } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOTPEmail(email, otp, type);

    // ✅ Fix — in-memory object ki jagah DB mein upsert karo
    // Pehle: pendingOtps[email] = { otp, createdAt: Date.now() }
    // Ab: findOneAndUpdate with upsert — agar pehle se record ho (resend case) toh update karo
    await OtpRecord.findOneAndUpdate(
      { email },
      { otp, verified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({ msg: "OTP sent to email." });

  } catch (error) {
    res.status(500).json({ msg: "Failed to send OTP." });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  // ✅ Fix — DB se check karo
  const record = await OtpRecord.findOne({ email });

  if (!record) {
    return res.status(400).json({ msg: "No OTP found for this email." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  // TTL handle karta hai expiry — agar document exist karta hai toh valid hai
  // But createdAt check bhi rakhte hain extra safety ke liye
  const otpAge = Date.now() - new Date(record.createdAt).getTime();
  if (otpAge > 5 * 60 * 1000) {
    await OtpRecord.deleteOne({ email }); // expired record clean karo
    return res.status(400).json({ msg: "OTP expired" });
  }

  // ✅ Fix — DB mein verified: true set karo
  await OtpRecord.findOneAndUpdate({ email }, { verified: true });

  res.status(200).json({ msg: "OTP verified successfully" });
});

// Request Password Reset
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "No user found with this email" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await sendOTPEmail(email, otp, "reset");

    // ✅ Fix — DB mein upsert karo
    await OtpRecord.findOneAndUpdate(
      { email },
      { otp, verified: false, createdAt: new Date() },
      { upsert: true, new: true }
    );

    return res.status(200).json({ msg: "OTP sent for password reset" });

  } catch (err) {
    return res.status(500).json({ msg: "Failed to send OTP", error: err.message });
  }
});

// Verify Reset OTP
router.post('/verify-reset-otp', async (req, res) => {
  const { email, otp } = req.body;

  // ✅ Fix — DB se check karo
  const record = await OtpRecord.findOne({ email });

  if (!record) {
    return res.status(400).json({ msg: "No OTP found for this email." });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }

  const otpAge = Date.now() - new Date(record.createdAt).getTime();
  if (otpAge > 5 * 60 * 1000) {
    await OtpRecord.deleteOne({ email });
    return res.status(400).json({ msg: "OTP expired" });
  }

  await OtpRecord.findOneAndUpdate({ email }, { verified: true });

  return res.status(200).json({ msg: "OTP verified. You can reset your password." });
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ msg: "Email and new password required" });
  }

  // ✅ Fix — DB se check karo
  const record = await OtpRecord.findOne({ email });

  if (!record || !record.verified) {
    return res.status(403).json({ msg: "OTP not verified for this email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    // ✅ Fix — password reset ke baad OTP record delete karo
    await OtpRecord.deleteOne({ email });

    return res.status(200).json({ msg: "Password changed successfully" });

  } catch (err) {
    return res.status(500).json({ msg: "Something went wrong", error: err.message });
  }
});

// Google Login
router.post("/google-precheck", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ msg: "Google token missing" });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const jwtToken = jwt.sign(
        { id: existingUser._id, email: existingUser.email, role: existingUser.role },
        process.env.JSON_WEB_TOKEN_SECRET_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        existingUser: true,
        user: existingUser,
        token: jwtToken,
      });
    }

    return res.status(200).json({
      existingUser: false,
      prefill: { name, email },
    });

  } catch (err) {
    return res.status(401).json({ msg: "Invalid Google token" });
  }
});

// Get User by ID
router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid User ID format' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'The user with the given ID was not found' });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update User
router.put('/:id', verifyToken, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid User ID format' });
  }

  const { name, phone, email, password } = req.body;

  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (name) existingUser.name = name;
    if (phone) existingUser.phone = phone;
    if (email) existingUser.email = email;

    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      existingUser.password = hashed;
    }

    const updatedUser = await existingUser.save();

    return res.status(200).json({
      msg: 'User updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Delete User
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ msg: 'Invalid User ID format' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ msg: 'The user with the given ID was not found' });
    }
    return res.status(200).json({ msg: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Count Users
router.get('/get/count', verifyToken, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    return res.status(200).json({ count: userCount });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;