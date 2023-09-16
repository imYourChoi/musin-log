const { productModel } = require("./model");
const { errorHandler, getSortOption, escapeRegExp } = require("./util");

const allProductHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel
      .find({}, { price_history: 0 })
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    errorHandler(res, error, "allProducts");
  }
};

const allProductDetailHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel.find({}).sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    errorHandler(res, error, "allProductsDetail");
  }
};

const oneProductHandler = async (req, res) => {
  try {
    const { product_id } = req.query;
    const product = await productModel.findOne({ product_id: product_id });
    res.status(200).json({ product });
  } catch (error) {
    errorHandler(res, error, "oneProduct");
  }
};

const searchProductsHandler = async (req, res) => {
  try {
    const { keyword, sort } = req.query;
    const escapedKeyword = escapeRegExp(keyword);
    const products = await productModel
      .find(
        {
          $or: [
            { name: { $regex: escapedKeyword, $options: "i" } },
            { brand: { $regex: escapedKeyword, $options: "i" } },
          ],
        },
        { price_history: 0 }
      )
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    errorHandler(res, error, "searchProducts");
  }
};

module.exports = {
  allProductHandler,
  allProductDetailHandler,
  oneProductHandler,
  searchProductsHandler,
};
