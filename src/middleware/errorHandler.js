// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code was set
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    // In development: send full error details so you can debug
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack        // shows exactly where the error happened
    })
  }

  if (process.env.NODE_ENV === 'production') {
    // In production: never expose internal details to users
    if (err.isOperational) {
      // Expected errors (our AppErrors) — safe to show message
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    // Unexpected errors (bugs, crashes) — hide details
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }
}

module.exports = errorHandler