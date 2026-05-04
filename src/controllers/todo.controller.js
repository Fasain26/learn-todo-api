// src/controllers/todo.controller.js
const { todos, getNextId } = require('../data/todos')

// GET /api/todos
const getAll = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: todos.length,
    data: todos
  })
}

// GET /api/todos/:id
const getOne = (req, res) => {
  const id = parseInt(req.params.id)
  const todo = todos.find(t => t.id === id)

  if (!todo) {
    return res.status(404).json({
      status: 'error',
      message: `Todo with id ${id} not found`
    })
  }

  res.status(200).json({
    status: 'success',
    data: todo
  })
}

// POST /api/todos
const createTodo = (req, res) => {
  // Guard against missing body entirely
  if (!req.body) {
    return res.status(400).json({
      status: 'error',
      message: 'Request body is required'
    })
  }

  const { title } = req.body

  if (!title || title.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Title is required'
    })
  }

  const newTodo = {
    id: getNextId(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString()
  }

  todos.push(newTodo)

  res.status(201).json({
    status: 'success',
    data: newTodo
  })
}

// PUT /api/todos/:id
const updateTodo = (req, res) => {
  const id = parseInt(req.params.id)
  const todo = todos.find(t => t.id === id)

  if (!todo) {
    return res.status(404).json({
      status: 'error',
      message: `Todo with id ${id} not found`
    })
  }

  const { title, completed } = req.body

  if (title !== undefined) todo.title = title.trim()
  if (completed !== undefined) todo.completed = completed

  res.status(200).json({
    status: 'success',
    data: todo
  })
}

// DELETE /api/todos/:id
const deleteTodo = (req, res) => {
  const id = parseInt(req.params.id)
  const index = todos.findIndex(t => t.id === id)

  if (index === -1) {
    return res.status(404).json({
      status: 'error',
      message: `Todo with id ${id} not found`
    })
  }

  todos.splice(index, 1)

  res.status(204).send()
}

module.exports = { getAll, getOne, createTodo, updateTodo, deleteTodo }