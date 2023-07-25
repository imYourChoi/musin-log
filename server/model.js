const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  item_id: String,
  name: String,
  brand: String,
  img_url: String,
  original_price: Number,
  price_history: [
    {
      date: String,
      current_price: Number,
      discount_rate: Number,
      discount_amount: Number,
      discount: Boolean,
      available: Boolean,
    },
  ],
});

module.exports = { itemModel: mongoose.model("Item", ItemSchema) };
