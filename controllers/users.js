const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const InternalError = require('../errors/InternalError');
// const NotFoundError = require('../errors/NotFoundError');

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then(
    ((hash) => User.create({
      email,
      name,
      about,
      avatar,
      password: hash,
      select: false,
    }))
      .then((user) => res.send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          throw new BadRequestError('Переданы неккоректные данные');
        }
        throw new InternalError('Что-то пошло не так');
      }),
  );
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400)
          .send({ message: 'Переданы неккоректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.patchProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, name, about }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' }, 'super-secret-key');
      // закукили токен
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      // вернули токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

// module.exports.getMe = (req, res) => {
//   User.findById(req.params.userId)
//     .then((user) => {
//       if (!user) {
//         return new NotFoundError('Пользователь не найден');
//       }
//       return res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//         return res
//           .status(400)
//           .send({ message: 'Переданы неккоректные данные' });
//       }
//       return new InternalError('Что-то пошло не так');
//     });
// };
module.exports.getMe = (req, res) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => res.send(user))
    .catch((err) => res.status(500).send({ message: err.message }));
};
