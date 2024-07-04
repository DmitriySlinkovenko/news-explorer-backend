const router = require("express").Router();
const userRouter = require("./users");
const newsRouter = require("./news");
const { login, createUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");
const {
  validateUserCreation,
  validateUserLogin,
} = require("../middlewares/validation");

router.use("/items", newsRouter);
router.post("/signup", validateUserCreation, createUser);
router.post("/signin", validateUserLogin, login);
router.use(auth);
router.use("/users", userRouter);

router.use("*", (req, res, next) =>
  next(new NotFoundError("Route does not exist."))
);

module.exports = router;
