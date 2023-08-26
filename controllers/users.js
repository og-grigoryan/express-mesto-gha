const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../constants/constants');

const User = require('../models/users');

const getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => {
      res.status(CREATED_CODE).send({ data: newUser });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
      }
    });
};

const updateUserData = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id пользователя' });
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUserData,
  updateUserAvatar,
};
