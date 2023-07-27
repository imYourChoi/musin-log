const express = require("express");
const router = express.Router();

const productHandlers = require("./controller");

router.get("/all", productHandlers.allProductsHandler);

router.get("/one", productHandlers.oneProductHandler);

module.exports = router;
