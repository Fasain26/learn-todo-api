// src/controllers/todo.controller.js
const { todos, getNextId } = require('../data/todos')
const AppError = require('../utils/AppError')

const getAll = (req, res) => {
  res.status(200).json({
    status: 'success',
    count: todos.length,
    data: todos
  })
}

const getOne = (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      throw new AppError('Invalid ID — must be a number', 400)
    }
    const todo = todos.find(t => t.id === id)
    

    if (!todo) throw new AppError(`Todo with id ${id} not found`, 404)

    res.status(200).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)   // passes error to the global error handler
  }
}

const createTodo = (req, res, next) => {
  try {
    if (!req.body) throw new AppError('Request body is required', 400)

    const { title } = req.body

    if (!title || title.trim() === '') {
      throw new AppError('Title is required', 400)
    }

    const newTodo = {
      id: getNextId(),
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    todos.push(newTodo)

    res.status(201).json({ status: 'success', data: newTodo })
  } catch (err) {
    next(err)
  }
}

const updateTodo = (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      throw new AppError('Invalid ID — must be a number', 400)
    }
    const todo = todos.find(t => t.id === id)

    

    if (!todo) throw new AppError(`Todo with id ${id} not found`, 404)

    const { title, completed } = req.body

    if (title !== undefined) todo.title = title.trim()
    if (completed !== undefined) todo.completed = completed

    res.status(200).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)
  }
}

const deleteTodo = (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      throw new AppError('Invalid ID — must be a number', 400)
    }
    const index = todos.findIndex(t => t.id === id)

    

    if (index === -1) throw new AppError(`Todo with id ${id} not found`, 404)

    todos.splice(index, 1)

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getOne, createTodo, updateTodo, deleteTodo }