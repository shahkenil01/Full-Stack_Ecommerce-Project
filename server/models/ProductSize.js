const mongoose = require('mongoose');

const productSizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  dateCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ProductSize', productSizeSchema);
