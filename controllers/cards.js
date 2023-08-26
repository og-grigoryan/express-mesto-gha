const {
  CREATED_CODE,
  BAD_REQUEST_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../constants/constants');

const Card = require('../models/cards');

const getCards = (req, res) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.status(CREATED_CODE).send({ data: newCard });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
      }
    });
};

const deleteСard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .orFail()
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const likeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

const dislikeCard = (req, res) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Передан некорректный _id карточки' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'Произошла неизвестная ошибка на сервере' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
};
