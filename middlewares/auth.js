const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const cookieAuthorization = req.cookies.jwt;
  if (!cookieAuthorization) {
    return AuthorizationError(next);
  }
  let payload;
  try {
    payload = jwt.verify(cookieAuthorization, 'super-secret-key');
  } catch (err) {
    return AuthorizationError(next);
  }
  req.user = payload;
  return next();
};