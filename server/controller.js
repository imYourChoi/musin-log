const { productModel } = require("./model");

const allProductHandler = async (req, res) => {
  try {
    const products = await productModel.find({}, { price_history: 0, _id: 0 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      error: "Products/allProducts : Internal Server Error",
    });
  }
};

const allProductDetailHandler = async (req, res) => {
  try {
    const products = await productModel.find({}, { _id: 0 });
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      error: "Products/allProducts : Internal Server Error",
    });
  }
};

const oneProductHandler = async (req, res) => {
  try {
    const { product_id } = req.query;
    const product = await productModel.findOne(
      { product_id: product_id },
      { _id: 0 }
    );
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({
      error: "Products/oneProduct : Internal Server Error",
    });
  }
};

const searchProductsHandler = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await productModel.find(
      {
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { brand: { $regex: keyword, $options: "i" } },
        ],
      },
      { price_history: 0, _id: 0 }
    );
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      error: "Products/searchProducts : Internal Server Error",
    });
  }
};

module.exports = {
  allProductHandler,
  allProductDetailHandler,
  oneProductHandler,
  searchProductsHandler,
};
