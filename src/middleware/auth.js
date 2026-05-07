// src/middleware/auth.js
const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')

const protect = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided — please log in', 401)
    }

    // Extract token — "Bearer eyJhbGci..." → "eyJhbGci..."
    const token = authHeader.split(' ')[1]

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Attach user info to request — available in all downstream handlers
    req.user = decoded

    next()
  } catch (err) {
    // jwt.verify throws specific errors we should handle
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401))
    }
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Token expired — please log in again', 401))
    }
    next(err)
  }
}

module.exports = { protect }