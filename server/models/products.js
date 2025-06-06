const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  indexNumber: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true
  },
  description: {
    type: String,
    required: [true, "Product description is required"]
  },
  images: [{
    type: String,
    required: [true, "Product image URL is required"]
  }],
  brand: {
    type: String,
    required: [true, "Brand is required"],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Product price is required"],
    min: [0, "Price must be at least 0"]
  },
  oldPrice: {
    type: Number,
    default: 0,
    min: [0, "Old price must be at least 0"]
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, "Product category is required"]
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: false
  },
  countInStock: {
    type: Number,
    required: [true, "Stock count is required"],
    min: [0, "Count in stock must be at least 0"]
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  productRAMS: [{
    type:String,
  }],
  productSIZE: [{
    type:String,
  }],
  productWEIGHT: [{
    type:String,
  }],
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

exports.Product = mongoose.model('Product', productSchema);