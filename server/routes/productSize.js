const express = require('express');
const router = express.Router();
const ProductSize = require('../models/ProductSize');
const isAdmin = require('../middleware/isAdmin');
const verifyToken = require('../middleware/auth');

router.get('/', async (req, res) => {
  const sizes = await ProductSize.find().sort({ dateCreated: 1 });
  res.json({ success: true, data: sizes });
});

router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const size = new ProductSize({ name: req.body.name });
    await size.save();
    res.json({ success: true, data: size });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const updatedSize = await ProductSize.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json({ success: true, data: updatedSize });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    await ProductSize.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
