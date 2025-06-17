const Cart = require('../models/Cart');
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {

  try{
    const cartList = await Cart.find(req.query);

    if (!cartList) {
      res.status(500).json({ success: false })
    }
  
    return res.status(200).json(cartList)

  }catch(error){
    res.status(500).json({ success: false })
  }
});

router.post('/add', verifyToken, async (req, res) => {
  let cartList = new Cart({
    productTitle: req.body.productTitle,
    image: req.body.image,
    rating: req.body.rating,
    price: req.body.price,
    quantity: req.body.quantity,
    subTotal: req.body.subTotal,
    productId: req.body.productId,
    userId: req.body.userId,
  });

  if (!cartList) {
    return res.status(500).json({
      error: err,
      success: false
    });
  }

  cartList = await cartList.save();

  res.status(201).json(cartList);
});

router.delete('/remove', verifyToken, async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      res.status(404).json({
        message: 'The cart item given id is not found!',
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

module.exports = router;
