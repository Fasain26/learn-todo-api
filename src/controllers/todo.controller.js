// src/controllers/todo.controller.js
const prisma = require('../utils/prisma')
const AppError = require('../utils/AppError')

const getAll = async (req, res, next) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    })

    res.status(200).json({
      status: 'success',
      count: todos.length,
      data: todos
    })
  } catch (err) {
    next(err)
  }
}

const getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError('Invalid ID — must be a number', 400)

    const todo = await prisma.todo.findUnique({
      where: { id }
    })

    if (!todo) throw new AppError(`Todo with id ${id} not found`, 404)

    res.status(200).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)
  }
}

const createTodo = async (req, res, next) => {
  try {
    if (!req.body) throw new AppError('Request body is required', 400)

    const { title } = req.body
    if (!title || title.trim() === '') {
      throw new AppError('Title is required', 400)
    }

    const todo = await prisma.todo.create({
      data: {
        title: title.trim()
      }
    })

    res.status(201).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)
  }
}

const updateTodo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError('Invalid ID — must be a number', 400)

    const existing = await prisma.todo.findUnique({ where: { id } })
    if (!existing) throw new AppError(`Todo with id ${id} not found`, 404)

    const { title, completed } = req.body

    const todo = await prisma.todo.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(completed !== undefined && { completed })
      }
    })

    res.status(200).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)
  }
}

const deleteTodo = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError('Invalid ID — must be a number', 400)

    const existing = await prisma.todo.findUnique({ where: { id } })
    if (!existing) throw new AppError(`Todo with id ${id} not found`, 404)

    await prisma.todo.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getOne, createTodo, updateTodo, deleteTodo }