const { CREATED_CODE } = require('../constants/constants');
const Card = require('../models/cards');
const errorsHandler = require('../errors/errorsHandler');

const getCards = (req, res, next) => {
  Card.find()
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      next(errorsHandler(err));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.status(CREATED_CODE).send({ data: newCard });
    })
    .catch((err) => {
      next(errorsHandler(err));
    });
};

const deleteСard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail()
    // eslint-disable-next-line consistent-return
    .then((card) => {
      const ownerId = card.owner._id.toString();

      if (userId === ownerId) {
        Card.findByIdAndRemove(cardId)
          .orFail()
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch((err) => {
            next(errorsHandler(err));
          });
      } else {
        return next(errorsHandler('ForbiddenError'));
      }
    })
    .catch((err) => {
      next(errorsHandler(err));
    });
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(errorsHandler(err));
    });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      next(errorsHandler(err));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
};
