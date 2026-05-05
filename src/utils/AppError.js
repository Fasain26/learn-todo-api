// src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)           // calls the built-in Error constructor
    this.statusCode = statusCode
    this.status = statusCode >= 400 && statusCode < 500 ? 'error' : 'fail'
    this.isOperational = true  // marks this as an expected, handled error
  }
}

module.exports = AppError