const { productModel } = require("./model");

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

const oneProductHandler = async (req, res) => {
  try {
    const { product_id } = req.query;
    const product = await productModel.findOne({ product_id: product_id });
    res.status(200).json({ product });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Products/oneProduct : Internal Server Error" });
  }
};

module.exports = {
  allProductsHandler,
  oneProductHandler,
};
