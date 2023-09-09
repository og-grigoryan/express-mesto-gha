const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const express = require('express');
const mongoose = require('mongoose');

const { createUser, login } = require('./controllers/users');
const {
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  CONFLICT_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  URL_REGULAR_EXP,
} = require('./constants/constants');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

// utils
app.use(express.json());
app.use(helmet()); // USE HELMET
app.use(limiter); // USE LIMITER

// authorization
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGULAR_EXP),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

// protected routes with middlewares auth
app.use(userRouter);
app.use(cardRouter);

// wrong path
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Неправильно указан запрос' });
});

// celebrate error handler
app.use(errors());

// central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'AuthorizationError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.name === 'ForbiddenError') {
    res.status(err.statusCode).send({ message: err.message });
    return;
  }

  if (err.name === 'ValidationError') {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные' });
    return;
  }

  if (err.code === 11000) {
    res.status(CONFLICT_ERROR_CODE).send({ message: 'Пользователь с таким E-mail уже существует' });
    return;
  }

  if (err.name === 'DocumentNotFoundError') {
    res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Указанный _id не найден' });
    return;
  }

  if (err.name === 'CastError') {
    res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id' });
    return;
  }

  res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
});

app.listen(PORT, () => {
  console.log(`Сервер открыт на порту: ${PORT}`);
});
