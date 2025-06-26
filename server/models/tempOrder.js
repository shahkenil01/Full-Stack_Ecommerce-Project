const mongoose = require("mongoose");

const tempOrderSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  cartItems: { type: Array, required: true },
  formFields: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // auto-delete after 10 mins
});

module.exports = mongoose.model("TempOrder", tempOrderSchema);
