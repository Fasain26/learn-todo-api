// src/app.js
require('dotenv').config()
const express = require('express')

const todoRoutes = require('./routes/todo.routes')

const app = express()

// Middleware
app.use(express.json())

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

// Mount the todo routes at /api/todos
app.use('/api/todos', todoRoutes)

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.url} not found`
  })
})

// Start server
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV}`)
})