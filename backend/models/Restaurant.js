const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  cuisine: String,
  rating: Number,
  image: String,
});

module.exports = mongoose.model("Restaurant", restaurantSchema);

