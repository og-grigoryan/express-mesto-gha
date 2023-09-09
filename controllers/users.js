const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CREATED_CODE } = require('../constants/constants');
const AuthorizationError = require('../errors/AuthorizationError');
const User = require('../models/users');

const getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(next);
};

const getUserMe = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email,
        password: hash,
        name,
        about,
        avatar,
      })
        .then((newUser) => {
          const data = newUser.toObject();
          delete data.password;
          res.status(CREATED_CODE).send(data);
        })
        .catch(next);
    })
    .catch(next);
};

const updateUserData = (req, res, next) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  User.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        return next(new AuthorizationError('Неправильные почта или пароль'));
      }

      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new AuthorizationError('Неправильные почта или пароль'));
          }

          const token = jwt.sign({ _id: user._id }, 'SECRET_KEY', { expiresIn: '7d' }); // HARDCODE SECRET_KEY
          // eslint-disable-next-line consistent-return
          return res.send({ JWT: token });
        });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  getUserMe,
  updateUserData,
  updateUserAvatar,
  createUser,
  login,
};
