const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../models/order");

router.post("/create", async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      products,
      name,
      addressLine1,
      addressLine2,
      totalAmount,
      email,
      phone,
    } = req.body;

    if (!orderId || !paymentId || !products || !name || !email || !totalAmount || !phone) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const formatAddress = (line1, line2) => {
      if (line1 && !line2) return line1.slice(0, 15);
      if (line1 && line2) return line1.slice(0, 10) + ", " + line2.slice(0, 5);
      return "";
    };

    const address = formatAddress(addressLine1, addressLine2);

    const newOrder = new Order({
      orderId,
      paymentId,
      products,
      name,
      address,
      totalAmount,
      email,
      phone,
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("🔥 Order Save Error:", err.message);
    res.status(500).json({ error: "Server error while saving order" });
  }
});

router.get("/user/:email", async (req, res) => {
  try {
    const orders = await Order.find({ email: req.params.email }).sort({ date: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

module.exports = router;
