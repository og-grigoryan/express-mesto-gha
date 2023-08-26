// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const express = require('express');
const mongoose = require('mongoose');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

const { NOT_FOUND_ERROR_CODE } = require('./constants/constants');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(helmet()); // USE HELMET
app.use(limiter); // USE LIMITER

// HARDCODE USER_ID
app.use((req, res, next) => {
  req.user = {
    _id: '64425a3174e66fb4415e48b9', // 64425a3174e66fb4415e48b9 - HARDCODE USER_ID
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Неправильно укзана запрос' });
});

app.listen(PORT, () => {
  console.log(`Сервер открыт на порту: ${PORT}`);
});
