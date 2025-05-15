const Category = require('../models/category.js');
const { Product } = require('../models/products.js');
const express = require('express');
const router = express.Router();

const pLimit = require('p-limit').default;
const cloudinary = require('cloudinary').v2;
const { uploadToCloudinary } = require('../utils/cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/', async (req, res) => {
  try {
    const productList = await Product.find().populate("category");
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { name, description, images, brand, price, oldPrice, category, countInStock, rating, isFeatured, numReviews } = req.body;

    if (!name || !description || !brand || !price || !category || !countInStock || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const imgUrls = images;

    const product = new Product({ name, description, images: imgUrls, brand, price, oldPrice, category, countInStock, rating, isFeatured, numReviews });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error. Could not create product.' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('res.cloudinary.com')) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.put('/:id', async (req, res) => {
  const limit = pLimit(2);
  const { name, description, brand, price, category: categoryId, countInStock, rating, isFeatured, images } = req.body;

  if (!name) return res.status(400).json({ error: "Product name is required" });
  if (!description) return res.status(400).json({ error: "Description is required" });
  if (!brand) return res.status(400).json({ error: "Brand is required" });
  if (!price || isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
  if (!categoryId) return res.status(400).json({ error: "Category is required" });

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ error: "Invalid category ID" });

  try {
    const existing = await Product.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Product not found!' });

    const newData = { name, description, brand, price, category: categoryId, countInStock, rating, isFeatured };

    let imageChanged = false;
    let newImages = existing.images;

    if (Array.isArray(images) && images.length > 0) {
      const oldUrls = existing.images;
      const areSame = images.length === oldUrls.length && images.every((url, i) => url === oldUrls[i]);

      if (!areSame) {
        imageChanged = true;

        for (const url of oldUrls) {
          if (url.includes("res.cloudinary.com")) {
            const parts = url.split('/');
            const publicId = parts[parts.length - 1].split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          }
        }
        newImages = images;
      }
    }

    const noTextChange = Object.entries(newData).every(([key, val]) => existing[key] == val);
    if (!imageChanged && noTextChange) {
      return res.status(200).json({ message: "Nothing to update", status: false });
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { ...newData, images: newImages }, { new: true });
    res.status(200).json({ message: "Product updated", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;