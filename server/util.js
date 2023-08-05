const errorHandler = (res, error, type) => {
  console.log(error);
  res.status(500).json({ error: `Internal Server Error : ${type}` });
};

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
      return { updated_at: -1 };
  }
};

const escapeRegExp = (keyword) => {
  return keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = { errorHandler, getSortOption, escapeRegExp };
