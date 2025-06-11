const express = require('express');
const router = express.Router();
const ProductWeight = require('../models/productWeight');
const verifyToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// GET
router.get('/', async (req, res) => {
  const weights = await ProductWeight.find().sort({ dateCreated: 1 });
  res.json({ success: true, data: weights });
});

// POST
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const weight = new ProductWeight({ name: req.body.name });
    await weight.save();
    res.json({ success: true, data: weight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedWeight = await ProductWeight.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json({ success: true, data: updatedWeight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await ProductWeight.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;