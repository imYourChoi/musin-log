const { productModel } = require("../model");

const allProductsHandler = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json({ products });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Products/allProducts : Internal Server Error" });
  }
};

module.exports = {
  allProductsHandler,
};
