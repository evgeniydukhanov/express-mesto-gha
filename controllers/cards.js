const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ValidationError = require('../errors/ValidationError');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(ValidationError('Переданы неккоректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(NotFoundError('Карточка не найдена'));
      }
      if ((card.owner._id.toString() !== req.user._id)) {
        next(ForbiddenError('Вы не можете удалить чужую карточку'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(CastError('Некорректный id карточки'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError')
        next(CastError('Переданы неккоретные данные'));
      if (!card) {
        next(NotFoundError('Карточки с таким ID не существует'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(CastError('Переданы некорректные данные'))
        if (!card) {
          next(NotFoundError('Карточки с таким ID не существует'));
        }
        next(err);

      };
    });
};
