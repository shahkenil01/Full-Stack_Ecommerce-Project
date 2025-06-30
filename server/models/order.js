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
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  paymentMethod: { type: String, enum: [ 'Credit/Debit Card', 'UPI', 'NetBanking', 'Wallet', 'Cashfree Payment' ], default: 'Cashfree Payment' },
  products: [productSchema],
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  country: String,
  city: String,
  state: String,
  zipCode: String,
  totalAmount: { type: Number, required: true },
  orderStatus: { type: String, default: "pending" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
