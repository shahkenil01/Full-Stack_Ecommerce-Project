const Category = require('../models/category');
const express = require('express');
const router = express.Router();

const pLimit = require('p-limit').default;
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/create', async (req, res) => {
  try {
    const limit = pLimit(2);

    if (!Array.isArray(req.body.images) || req.body.images.length === 0) {
      return res.status(400).json({ error: "No images provided", status: false });
    }

  const imagesToUpload = req.body.images.map((image) => {
      return limit(async () => {
          const result = await cloudinary.uploader.upload(image);
          return result;
      });
  });

  const uploadStatus = await Promise.all(imagesToUpload);

  const imgurl = uploadStatus.map((item) => {
    return item.secure_url
  })

  if (!uploadStatus) {
    return res.status(500).json({
    error: "images cannot upload!",
    status: false
    });
  }

  const existingCategory = await Category.findOne({ name: req.body.name.trim() });
  if (existingCategory) {
    return res.status(400).json({ success: false, message: "Category name already exists" });
  }
  let category = new Category({
    name: req.body.name,
    images: imgurl,
    color: req.body.color
  });

  if (!category) {
    return res.status(500).json({
      error: err,
      success: false
    });
  }

  category = await category.save();

  res.status(201).json({ success: true, message: "Category created", data: category });

  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get('/', async (req, res) => {

  try{
    const page = parseInt(req.query.page) || 1;
    const perPage = 4;
    const totalPosts = await Category.countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found"})
    }

    const categoryList = await Category.find()
      .skip((page - 1 ) * perPage)
      .limit(perPage)
      .exec();

    if (!categoryList) {
      res.status(500).json({ success: false })
    }
  
    return res.status(200).json({
      "categoryList":categoryList,
      "totalPages":totalPages,
      "page":page
    })

  }catch(error){
    res.status(500).json({ success: false })
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'The category with the given ID was not found.' });
    }

    return res.status(200).send(category);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: 'Category not found!',
        success: false
      });
    }

    if (category.images && category.images.length > 0) {
      for (const url of category.images) {
        const parts = url.split('/');
        const publicIdWithExtension = parts[parts.length - 1];
        const publicId = publicIdWithExtension.split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Category.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Category and its images deleted!'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong.',
      error: error.message
    });
  }
});




router.put('/:id', async (req, res) => {
  try {
    const limit = pLimit(2);

    const existing = await Category.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Category not found!' });
    }

    const newData = {
      name: req.body.name,
      color: req.body.color,
      icon: req.body.icon
    };

    if (newData.name && newData.name.trim() !== existing.name) {
      const duplicate = await Category.findOne({ name: newData.name.trim() });
      if (duplicate && duplicate._id.toString() !== req.params.id) {
        return res.status(400).json({ success: false, message: "Category Name already exists!" });
      }
    }

    let imageChanged = false;
    let newImages = existing.images;

    if (Array.isArray(req.body.images) && req.body.images.length > 0) {
      const newUrls = req.body.images;
      const oldUrls = existing.images;

      const areSame =
        newUrls.length === oldUrls.length &&
        newUrls.every((url, i) => url === oldUrls[i]);

      if (!areSame) {
        imageChanged = true;

        for (const url of oldUrls) {
          if (typeof url === 'string' && url.includes("res.cloudinary.com")) {
            const parts = url.split('/');
            const lastPart = parts[parts.length - 1];
            const publicId = lastPart.split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          }
        }

        const imagesToUpload = newUrls.map((image) => {
          return limit(() => cloudinary.uploader.upload(image));
        });

        const uploadStatus = await Promise.all(imagesToUpload);
        newImages = uploadStatus.map((item) => item.secure_url);
      }
    }

    const noTextChange =
      existing.name === newData.name &&
      existing.color === newData.color &&
      existing.icon === newData.icon;

    if (!imageChanged && noTextChange) {
      return res.status(200).json({ message: "Nothing to update", success: true });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...newData,
        images: newImages
      },
      { new: true }
    );

    return res.status(200).json({ success: true, message: "Category updated", data: updatedCategory });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});


module.exports = router;
