const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  name: String,
  image: String,
  rating: Number,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model("Favorite", favoriteSchema);
