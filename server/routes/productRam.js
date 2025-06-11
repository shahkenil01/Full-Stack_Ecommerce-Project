const express = require('express');
const router = express.Router();
const ProductRam = require('../models/productRam');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET all
router.get('/', async (req, res) => {
  const rams = await ProductRam.find().sort({ dateCreated: 1 });
  res.json({ success: true, data: rams });
});

// POST new
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const ram = new ProductRam({ name: req.body.name });
    await ram.save();
    res.json({ success: true, data: ram });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedRam = await ProductRam.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json({ success: true, data: updatedRam });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await ProductRam.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;