const mongoose = require('mongoose');

const productWeightSchema = new mongoose.Schema({
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

module.exports = mongoose.model('ProductWeight', productWeightSchema);
