// src/app.js
require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const AppError = require('./utils/AppError')
const authRoutes = require('./routes/auth.routes')
const todoRoutes = require('./routes/todo.routes')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./middleware/logger')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./utils/swagger')

const app = express()

app.use(helmet())

// Rate limiters — disabled in test environment
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 100,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later'
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 10,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  }
})

app.use(generalLimiter)
app.use(express.json())
app.use(logger)

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Todo API is running'
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/auth', authLimiter, authRoutes)
app.use('/api/todos', todoRoutes)

app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.url} not found`, 404))
})

app.use(errorHandler)

module.exports = app  // ← export app, don't start server here