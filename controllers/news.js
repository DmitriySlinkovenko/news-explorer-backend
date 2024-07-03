const News = require("../models/news");

const createItem = (req, res, next) => {
  const { name, description, urlToImage, publishedAt, title } = req.body;
  News.create({ name, description, urlToImage, publishedAt, title })
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data."));
      }
      next(err);
    });
};

function deleteItem(req, res, next) {
  const { itemId } = req.params;
  News.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found."));
      }
      return News.deleteOne(item)
        .then(() => res.status(200).send({ message: "Item deleted" }))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item not found."));
      }
      next(err);
    });
}

function getItems(req, res, next) {
  News.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getItems,
  deleteItem,
  createItem,
};
