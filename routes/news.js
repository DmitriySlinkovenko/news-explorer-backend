const express = require("express");

const router = express.Router();

const { createItem, deleteItem, getItems } = require("../controllers/news");
const { auth } = require("../middlewares/auth");
const { validateId, validateCardBody } = require("../middlewares/validation");

router.use(auth);
router.get("/", getItems);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateId, deleteItem);
