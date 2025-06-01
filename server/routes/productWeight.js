const express = require('express');
const router = express.Router();
const ProductWeight = require('../models/productWeight');

// GET all
router.get('/', async (req, res) => {
  const weights = await ProductWeight.find().sort({ dateCreated: 1 }); // ascending
  res.json({ success: true, data: weights });
});

// POST new
router.post('/', async (req, res) => {
  try {
    const weight = new ProductWeight({ name: req.body.name });
    await weight.save();
    res.json({ success: true, data: weight });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
  await ProductWeight.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
