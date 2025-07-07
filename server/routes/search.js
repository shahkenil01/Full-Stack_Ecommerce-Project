const { Product } = require('../models/products.js');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ msg: 'Query is required' });
    }

    const items = await Product.find().populate('category');

    const filteredItems = items.filter(item =>
      item.name?.toLowerCase().includes(query.toLowerCase()) ||
      item.brand?.toLowerCase().includes(query.toLowerCase()) ||
      item.category?.name?.toLowerCase().includes(query.toLowerCase())
    );

    res.json(filteredItems);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
