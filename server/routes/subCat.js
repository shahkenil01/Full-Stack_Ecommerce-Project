const { SubCategory } = require('../models/subCat')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try{
    const subCat = await SubCategory.find().populate("category");
    if (!subCat) {
      res.status(500).json({ success: false })
    }
    return res.status(200).json(subCat);
  }catch(error){
    res.status(500).json({ success: false})
  }
});

router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const subCats = await SubCategory.find({ category: req.params.categoryId });
    res.status(200).json(subCats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch subcategories', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subCat = await SubCategory.findById(req.params.id).populate("category");

    if (!subCat) {
      return res.status(404).json({ message: 'The sub category with the given ID was not found.' });
    }

    return res.status(200).send(subCat);
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
});

router.post('/create', async (req, res) => {
  try {

  let subCat = new SubCategory({
    category: req.body.category,
    subCat:req.body.subCat
  });

  if (!subCat) {
    return res.status(500).json({
      error: err,
      success: false
    });
  }

  subCat = await subCat.save();

  res.status(201).json({ success: true, message: "Sub Category created", data: subCat });

  } catch (error) {
    console.error("Error creating subCategory:", error);
    res.status(500).json({ error: error.message, success: false });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    
    const deletedSubCat = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deletedSubCat) {
      return res.status(404).json({
        message: 'Sub Category not found!',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Sub Category deleted!'
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
    const subCat = await SubCategory.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        subCat: req.body.subCat
      },
      { new: true }
    );

    if (!subCat) {
      return res.status(404).json({ message: 'Sub Category not found!', success: false });
    }

    res.status(200).json({ success: true, data: subCat });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.', error: error.message });
  }
});

module.exports = router;