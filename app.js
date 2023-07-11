require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoutes = require("./src/routes/product");
const categoryRoutes = require("./src/routes/category");
const authRoutes = require("./src/routes/auth");
const cors = require("cors");

const app = express();

// CORS middleware
app.use(cors());

app.use(bodyParser.json());

mongoose.connect(
  `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@shop-app.tid0c13.mongodb.net/?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Routes
app.use(productRoutes);
app.use(categoryRoutes);
app.use("/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB.");
});

app.listen(process.env.PORT, () => {
  console.log(`Server runs at ${process.env.PORT} port.`);
});
