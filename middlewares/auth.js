const jwt = require('jsonwebtoken');
const errorsHandler = require('../errors/errorsHandler');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(errorsHandler('UnauthorizedError'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET_KEY'); // HARDCODE SECRET_KEY
  } catch (err) {
    return next(errorsHandler('UnauthorizedError'));
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
