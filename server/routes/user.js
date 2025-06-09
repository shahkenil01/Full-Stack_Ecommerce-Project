const { User } = require('../models/user');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

// POST SignUp
router.post('/signup', async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exist" })
    } 

    const hashPassword = await bcrypt.hash(password,10);

    const userRole = role && ['admin', 'client'].includes(role) ? role : 'client';

    const result = await User.create({
      name:name,
      phone:phone,
      email:email,
      password:hashPassword,
      role: userRole
    });

    const token = jwt.sign({ email:result.email, id: result._id, role: result.role }, process.env.JSON_WEB_TOKEN_SECRECT_KEY, { expiresIn: '1h' });

    res.status(200).json({
      user:result,
      token:token
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:"somthing went wrong"});
  }
});

// POST SignIn
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: email });

    if (!existingUser) {
      res.status(404).json({ msg: "User already exist" })
    } 

    const matchPassword = await bcrypt.compare(password, existingUser.password);

    if(!matchPassword){
      return res.status(400).json({ msg: "Invalid credntials"})
    }

    const token = jwt.sign({ email:existingUser.email, id: existingUser._id, role: existingUser.role }, process.env.JSON_WEB_TOKEN_SECRECT_KEY, { expiresIn: '1h' });

    res.status(200).json({
      user:existingUser,
      token:token,
      msg:"user Authenticated"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:"somthing went wrong"});
  }
});

// Get User
router.get('/', async (req, res) => {
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

// Protected route
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: 'Internal Server Error', error: error.message });
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

// delete User by ID
router.delete('/:id', async (req, res) => {
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

// Count Total User
router.get('/get/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    return res.status(200).json({ count: userCount });
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update User Info
router.put('/:id', async (req, res) => {
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

module.exports = router;
