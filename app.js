const express = require("express");
const mongoose = require("mongoose");

const app = express();
const { PORT = 3002 } = process.env;

mongoose.connect("mongodb://127.0.0.1:27017/news_explorer");

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
