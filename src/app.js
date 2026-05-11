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

// Security
app.use(helmet())

// Rate limiters
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Too many requests, please try again later'
  }
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    status: 'error',
    message: 'Too many login attempts, please try again later'
  }
})

app.use(generalLimiter)

// Middleware
app.use(express.json())
app.use(logger)

// Base routes
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

// API routes
app.use('/auth', authLimiter, authRoutes)
app.use('/api/todos', todoRoutes)
// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Unknown routes
app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.url} not found`, 404))
})

// Global error handler — must be last
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})