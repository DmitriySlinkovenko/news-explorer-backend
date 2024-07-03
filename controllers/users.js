const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const { JWT_SECRET } = require("../utils/config");

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found."));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid data."));
      }
      next(err);
    });
};

function createUser(req, res, next) {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Enter a valid email."));
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("Email already exists."));
      }
      return bcrypt.hash(password, 10).then((hash) =>
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
          .then(() => {
            res.status(201).send({ name, avatar, email });
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              next(new BadRequestError("Invalid data."));
            }
            next(err);
          })
      );
    })
    .catch((err) => {
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Please enter your email and password."));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect password or email") {
        next(new UnauthorizedError("Invalid email or password."));
      }
      next(err);
    });
}

module.exports = {
  getUserById,
  createUser,
  login,
};
