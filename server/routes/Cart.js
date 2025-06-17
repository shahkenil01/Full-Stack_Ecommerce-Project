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

router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      res.status(404).json({
        message: 'The cart item given id is not found!',
        success: false
      });
    }

    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      res.status(404).json({
        message: 'Cart item not found!',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Category Item deleted!'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Something went wrong.',
      error: error.message
    });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  try {
    const cartList = await Cart.findByIdAndUpdate(
      req.params.id, {
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userId: req.body.userId,
      }, { new: true }
    )

    if (!cartList) {
      return res.status(500).json({
        message: 'Cart item cannot be updated!',
        success: false
      });
    }

    res.send(cartList);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Something went wrong" });
  }
});

module.exports = router;
