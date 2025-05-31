const express = require('express');
const router = express.Router();
const ProductSize = require('../models/ProductSize');

router.get('/', async (req, res) => {
  const sizes = await ProductSize.find().sort({ dateCreated: -1 });
  res.json(sizes);
});

router.post('/', async (req, res) => {
  try {
    const size = new ProductSize({ name: req.body.name });
    await size.save();
    res.json(size);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedSize = await ProductSize.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json(updatedSize);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await ProductSize.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
