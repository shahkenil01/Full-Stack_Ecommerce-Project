const express = require('express');
const router = express.Router();
const ProductRam = require('../models/productRam');

// GET all
router.get('/', async (req, res) => {
  const rams = await ProductRam.find().sort({ dateCreated: 1 });
  res.json({ success: true, data: rams });
});

// POST new
router.post('/', async (req, res) => {
  try {
    const ram = new ProductRam({ name: req.body.name });
    await ram.save();
    res.json(ram);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT update
router.put('/:id', async (req, res) => {
  try {
    const updatedRam = await ProductRam.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updatedRam);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  await ProductRam.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;