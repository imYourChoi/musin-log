const express = require("express");
const router = express.Router();

const productHandlers = require("./controller");

router.get("/all", productHandlers.allProductsHandler);

router.get("/one", productHandlers.oneProductHandler);

router.get("/search", productHandlers.searchProductsHandler);

module.exports = router;
