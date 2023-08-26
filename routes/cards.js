const express = require('express');
const {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const cardRouter = express.Router();

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:cardId', deleteСard);
cardRouter.put('/cards/:cardId/likes', likeCard);
cardRouter.delete('/cards/:cardId/likes', dislikeCard);

module.exports = { cardRouter };
