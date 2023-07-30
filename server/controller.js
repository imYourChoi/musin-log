const { productModel } = require("./model");

const getSortOption = (sort) => {
  switch (sort) {
    case "price_asc":
      return { original_price: 1 };
    case "price_desc":
      return { original_price: -1 };
    case "name_asc":
      return { name: 1 };
    case "name_desc":
      return { name: -1 };
    case "brand_asc":
      return { brand: 1 };
    case "brand_desc":
      return { brand: -1 };
    default:
      return { _id: 1 };
  }
};

const allProductHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel
      .find({}, { price_history: 0, _id: 0 })
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error : allProducts",
    });
  }
};

const allProductDetailHandler = async (req, res) => {
  try {
    const { sort } = req.query;
    const products = await productModel
      .find({}, { _id: 0 })
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
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
    res.status(500).json({
      error: "Internal Server Error : oneProduct",
    });
  }
};

const searchProductsHandler = async (req, res) => {
  try {
    const { keyword, sort } = req.query;
    const products = await productModel
      .find(
        {
          $or: [
            { name: { $regex: keyword, $options: "i" } },
            { brand: { $regex: keyword, $options: "i" } },
          ],
        },
        { price_history: 0, _id: 0 }
      )
      .sort(getSortOption(sort));
    res.status(200).json({ products });
  } catch (error) {
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
