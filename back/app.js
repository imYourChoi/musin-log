const express = require("express");
const cors = require("cors");
const { FRONT_URL: frontUrl, PORT: port } = require("./env");

const app = express();

require("./db");

const corsOptions = {
  origin: [frontUrl],
  credentials: true,
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.listen(port, () => {
  console.log(`\nExpress 서버가 ${port}번 포트에서 실행됩니다.\n`);
});
