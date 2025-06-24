const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Product" },
  name: String,
  image: String,
  quantity: Number,
  price: Number,
  subtotal: Number,
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  paymentId: { type: String, required: true },
  products: [productSchema],
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  email: { type: String, required: true },
  orderStatus: { type: String, default: "pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
