const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  product_id: String,
  name: String,
  brand: String,
  img_url: String,
  original_price: Number,
  lowest_price: Number,
  updated_at: String,
  price_history: [
    {
      date: String,
      current_price: Number,
      available: Boolean,
    },
  ],
});

module.exports = { productModel: mongoose.model("product", ProductSchema) };
