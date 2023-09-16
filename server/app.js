const express = require("express");
const cors = require("cors");
const { FRONT_URL: frontUrl, PORT: port } = require("./src/env");

const app = express();

require("./src/db");

const corsOptions = { origin: [frontUrl], credentials: true };

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors(corsOptions));

app.use("/", require("./src/router"));

app.listen(port, () => {
  console.log(`Express 서버가 ${port}번 포트에서 실행됩니다.`);
});
