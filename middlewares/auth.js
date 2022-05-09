const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.headers.jwt;
  if (!authorization) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  let payload;
  try {
    payload = jwt.verify(authorization, 'super-secret-key');
  } catch (err) {
    return next(new AuthorizationError('Ошибка авторизации'));
  }
  req.user = payload;
  return next();
};
