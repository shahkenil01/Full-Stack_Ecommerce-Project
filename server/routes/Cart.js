const Cart = require('../models/Cart');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {

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

router.get("/user/:email", async (req, res) => {
  try {
    const userEmail = req.params.email;
    const cartItems = await Cart.find({ userEmail });
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error fetching cart items:", error.message);
    res.status(500).json({ message: "Server error while fetching cart items" });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { productTitle, image, rating, price, quantity, subTotal, productId, userEmail } = req.body;

    if (!userEmail) {
      return res.status(400).json({ success: false, error: "User email required" });
    }

    const newCartItem = new Cart({
      productTitle,
      image,
      rating: String(rating),
      price: String(price),
      quantity,
      subTotal,
      productId,
      userEmail,
    });

    const saved = await newCartItem.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error("Cart DB Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: 'Cart item not found!',
        success: false
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Cart item deleted!'
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
    const cartList = await Cart.findByIdAndUpdate(
      req.params.id, {
        productTitle: req.body.productTitle,
        image: req.body.image,
        rating: req.body.rating,
        price: req.body.price,
        quantity: req.body.quantity,
        subTotal: req.body.subTotal,
        productId: req.body.productId,
        userEmail: req.body.userEmail,
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
