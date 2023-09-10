const BadRequestError = require('./BadRequestError');
const ConflictError = require('./ConflictError');
const ForbiddenError = require('./ForbiddenError');
const NotFoundError = require('./NotFoundError');
const UnauthorizedError = require('./UnauthorizedError');
const ServerError = require('./ServerError');

// eslint-disable-next-line consistent-return
const errorsHandler = (err) => {
  if (err === 'UnauthorizedError') {
    return new UnauthorizedError('Необходима авторизация');
  }

  if (err === 'AuthorizationError') {
    return new UnauthorizedError('Неправильные почта или пароль');
  }

  if (err === 'ForbiddenError') {
    return new ForbiddenError('Нет прав для удаления этой карточки');
  }

  if (err === 'WrongPathError') {
    return new NotFoundError('Неправильно указан запрос');
  }

  if (err.name === 'DocumentNotFoundError') {
    return new NotFoundError('Указанный _id не найден');
  }

  if (err.name === 'ValidationError') {
    return new BadRequestError('Переданы некорректные данные');
  }

  if (err.name === 'CastError') {
    return new BadRequestError('Передан некорректный _id');
  }

  if (err.code === 11000) {
    return new ConflictError('Пользователь с таким E-mail уже существует');
  }

  return new ServerError('Произошла неизвестная ошибка на сервере');
};

module.exports = errorsHandler;
