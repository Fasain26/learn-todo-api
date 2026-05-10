// src/controllers/todo.controller.js
const prisma = require('../utils/prisma')
const AppError = require('../utils/AppError')

const getAll = async (req, res, next) => {
  try {
    // Read pagination params from query string
    // Default: page 1, 10 items per page
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    // Validate pagination params
    if (page < 1) throw new AppError('Page must be at least 1', 400)
    if (limit < 1 || limit > 100) {
      throw new AppError('Limit must be between 1 and 100', 400)
    }

    const skip = (page - 1) * limit

    // Run two queries in parallel — data and total count
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { userId: req.user.userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.todo.count({
        where: { userId: req.user.userId }
      })
    ])

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    res.status(200).json({
      status: 'success',
      data: todos,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    })
  } catch (err) {
    next(err)
  }
}

const getOne = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) throw new AppError('Invalid ID', 400)

    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId: req.user.userId  // can only see your own todos
      }
    })

    if (!todo) throw new AppError(`Todo with id ${id} not found`, 404)

    res.status(200).json({ status: 'success', data: todo })
  } catch (err) {
    next(err)
  }
}

const createTodo = async (req, res, next) => {
  try {
    const { title } = req.body  // guaranteed valid by middleware

    const todo = await prisma.todo.create({
      data: {
        title: title.trim(),
        userId: req.user.userId
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
    if (isNaN(id)) throw new AppError('Invalid ID', 400)

    const existing = await prisma.todo.findFirst({
      where: { id, userId: req.user.userId }
    })

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
    if (isNaN(id)) throw new AppError('Invalid ID', 400)

    const existing = await prisma.todo.findFirst({
      where: { id, userId: req.user.userId }
    })

    if (!existing) throw new AppError(`Todo with id ${id} not found`, 404)

    await prisma.todo.delete({ where: { id } })

    res.status(204).send()
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getOne, createTodo, updateTodo, deleteTodo }