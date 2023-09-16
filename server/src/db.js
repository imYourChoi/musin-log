const mongoose = require("mongoose");
const { MONGO_URI: mongoUri } = require("./env");

const db = mongoose.connection;

db.on("open", () => {
  console.log("데이터베이스에 연결되었습니다.");
});

db.on("disconnected", () => {
  console.log("데이터베이스와의 연결이 끊어졌습니다.");
  setTimeout(() => {
    mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 5000);
});

db.on("error", function (err) {
  console.error("데이터베이스 연결 에러 : " + err);
  mongoose.disconnect();
});

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
