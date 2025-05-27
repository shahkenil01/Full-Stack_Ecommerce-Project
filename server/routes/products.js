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
    const productList = await Product.find().populate("category").populate("subcategory");
    res.status(200).json(productList);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/create', async (req, res) => {
  try {
    const { name, description, images, brand, price, oldPrice, category, subcategory, countInStock, rating, isFeatured, numReviews } = req.body;

    if (!name || !description || !brand || !price || !category || !countInStock || !images || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please fill all required fields.' });
    }

    const imgUrls = images;

    const product = new Product({ name, description, images: imgUrls, brand, price, oldPrice, category, subcategory, countInStock, rating, isFeatured, numReviews });
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
  const { name, description, brand, price, category: categoryId, subcategory, countInStock, rating, isFeatured, images } = req.body;

  if (!name) return res.status(400).json({ error: "Product name is required" });
  if (!description) return res.status(400).json({ error: "Description is required" });
  if (!brand) return res.status(400).json({ error: "Brand is required" });
  if (!price || isNaN(price)) return res.status(400).json({ error: "Valid price is required" });
  if (!categoryId) return res.status(400).json({ error: "Category is required" });

  const category = await Category.findById(categoryId);
  if (!category) return res.status(404).json({ error: "Invalid category ID" });

  const existing = await Product.findById(req.params.id);
  if (!existing)   return res.status(404).json({ message: 'Product not found!' });

  try {
    // ─── 1) Determine which old URLs were removed by the user ────────────────
    const oldUrls = existing.images || [];
    const newUrls = Array.isArray(images) ? images : [];
    const toDelete = oldUrls.filter(u => !newUrls.includes(u));

    // ─── 2) Delete only those removed from Cloudinary ───────────────────────
    for (const url of toDelete) {
      if (typeof url === 'string' && url.includes('res.cloudinary.com')) {
        const parts = url.split('/');
        const publicId = parts.pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    // ─── 3) Build finalImages: keep URLs + upload new files ─────────────────
    const finalImages = await Promise.all(
      newUrls.map(item => {
        // if it’s already a URL, keep it
        if (typeof item === 'string' && item.startsWith('http')) {
          return Promise.resolve(item);
        }
        // otherwise it's new file data → upload it
        return limit(() => cloudinary.uploader.upload(item, { overwrite: false, unique_filename: true })
        ).then(r => r.secure_url);
      })
    );

    // ─── 4) Prepare the rest of the data and update ─────────────────────────
    const updatedData = { name, description, brand, price, category: categoryId, subcategory, countInStock, rating, isFeatured, images: finalImages };

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

module.exports = router;