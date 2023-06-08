require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 80,
  MONGO_URI: process.env.MONGO_URI,
  FRONT_URL: process.env.FRONT_URL || "http://localhost:3000",
};
