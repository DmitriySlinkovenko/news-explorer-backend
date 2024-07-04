const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3002 } = process.env;

const indexRouter = require("./routes/index");

app.use(express.json());
app.use(cors());
app.use(requestLogger);
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect("mongodb://127.0.0.1:27017/news_explorer");

app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
