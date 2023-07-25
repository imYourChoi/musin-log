const express = require("express");
const router = express.Router();

const itemHandlers = require("../services/items");

router.get("/all", itemHandlers.allItemsHandler);

module.exports = router;
