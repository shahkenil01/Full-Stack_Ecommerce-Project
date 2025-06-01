const mongoose = require('mongoose');

const productRamSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ProductRam', productRamSchema);
