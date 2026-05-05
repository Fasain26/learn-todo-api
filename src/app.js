// src/app.js
require('dotenv').config()
const express = require('express')
const AppError = require('./utils/AppError')

const todoRoutes = require('./routes/todo.routes')
const errorHandler = require('./middleware/errorHandler')
const logger = require('./middleware/logger')

const app = express()

// Middleware — order matters
app.use(express.json())
app.use(logger)          // log every request

// Routes
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

app.use('/api/todos', todoRoutes)

// Unknown routes — must be after all real routes
app.use((req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.url} not found`, 404))
})

// Global error handler — must be last, always
app.use(errorHandler)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})