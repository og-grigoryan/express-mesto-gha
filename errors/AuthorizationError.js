const { UNAUTHORIZED_ERROR_CODE } = require('../constants/constants');

class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
