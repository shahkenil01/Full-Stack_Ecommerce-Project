const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

router.get("/all", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch all orders:", error);
    res.status(500).json({ error: "Internal Server Error" });
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

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    if (!orderStatus) return res.status(400).json({ msg: "orderStatus is required" });

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ msg: "Order not found" });

    res.json({ msg: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Failed to update order status:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) return res.status(404).json({ msg: "Order not found" });

    res.json({ msg: "Order deleted successfully" });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
