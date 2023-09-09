const { CREATED_CODE } = require('../constants/constants');
const ForbiddenError = require('../errors/ForbiddenError');
const Card = require('../models/cards');

const getCards = (req, res, next) => {
  Card.find()
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((newCard) => {
      res.status(CREATED_CODE).send({ data: newCard });
    })
    .catch(next);
};

const deleteСard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .orFail()
    .populate(['owner', 'likes'])
    // eslint-disable-next-line consistent-return
    .then((card) => {
      const ownerId = card.owner._id.toString();

      if (userId === ownerId) {
        Card.findByIdAndRemove(cardId)
          .orFail()
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      } else {
        return next(new ForbiddenError('Нет прав для удаления этой карточки'));
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .orFail()
    .then((card) => {
      res.send({ data: card });
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteСard,
  likeCard,
  dislikeCard,
};
