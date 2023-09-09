const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const { URL_REGULAR_EXP } = require('../constants/constants');
const {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

// card routes
const cardRouter = express.Router();

cardRouter.get('/cards', auth, getCards);

cardRouter.post('/cards', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(URL_REGULAR_EXP),
  }),
}), createCard);

cardRouter.delete('/cards/:cardId', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), deleteСard);

cardRouter.put('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), likeCard);

cardRouter.delete('/cards/:cardId/likes', auth, celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().hex().length(24),
  }),
}), dislikeCard);

module.exports = { cardRouter };
