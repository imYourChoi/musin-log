const { productModel } = require("./model");
const { getSortOption, escapeRegExp } = require("./util");

const allProductHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel
      .find({}, { price_history: 0, _id: 0 })
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error : allProducts",
    });
  }
};

const allProductDetailHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel.aggregate([
      {
        $project: {
          _id: 0,
          name: 1,
          brand: 1,
          img_url: 1,
          original_price: 1,
          product_id: 1,
          updated_at: 1,
          price_history: {
            $map: {
              input: "$price_history",
              as: "priceItem",
              in: {
                date: "$$priceItem.date",
                current_price: "$$priceItem.current_price",
                available: "$$priceItem.available",
              },
            },
          },
        },
      },
      { $sort: getSortOption(sort) },
    ]);
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error : allProductsDetail",
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
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error : oneProduct",
    });
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
        { price_history: 0, _id: 0 }
      )
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Internal Server Error : searchProducts",
    });
  }
};

module.exports = {
  allProductHandler,
  allProductDetailHandler,
  oneProductHandler,
  searchProductsHandler,
};
