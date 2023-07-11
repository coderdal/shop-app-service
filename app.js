const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

console.log(process.env.USER_NAME);

const app = express();
app.use(bodyParser.json());

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@shop-app.tid0c13.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.on("connected", () => {
  console.log("MongoDB bağlantısı başarılı.");
});

app.listen(process.env.PORT, () => {
  console.log(`Sunucu ${process.env.PORT} portunda çalışıyor.`);
});
