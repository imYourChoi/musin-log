const { itemModel } = require("../model");

const allItemsHandler = async (req, res) => {
  try {
    const items = await itemModel.find({});
    console.log(items);
    res.status(200).json({ items });
  } catch (error) {
    res.status(500).json({ error: "Items/allItems : Internal Server Error" });
  }
};

module.exports = {
  allItemsHandler,
};
