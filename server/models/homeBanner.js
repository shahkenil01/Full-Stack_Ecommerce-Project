const mongoose = require("mongoose");

const homeBannerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

homeBannerSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

homeBannerSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("HomeBanner", homeBannerSchema);
