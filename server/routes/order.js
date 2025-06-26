const express = require("express");
const router = express.Router();
const Order = require("../models/order");

router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ date: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
