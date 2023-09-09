const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET_KEY'); // HARDCODE SECRET_KEY
  } catch (err) {
    return next(new AuthorizationError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
