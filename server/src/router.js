const express = require("express");
const router = express.Router();

const productHandlers = require("./controller");

router.get("/all", productHandlers.allProductHandler);

router.get("/all-detail", productHandlers.allProductDetailHandler);

router.get("/one", productHandlers.oneProductHandler);

router.get("/search", productHandlers.searchProductsHandler);

module.exports = router;
