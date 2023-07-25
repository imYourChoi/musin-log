const express = require("express");
const router = express.Router();

const productHandlers = require("../services/products");

router.get("/all", productHandlers.allProductsHandler);

module.exports = router;
