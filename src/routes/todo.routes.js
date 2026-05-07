// src/routes/todo.routes.js
const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo.controller')
const { protect } = require('../middleware/auth')

// protect applies to ALL routes below
router.use(protect)

router.get('/', todoController.getAll)
router.get('/:id', todoController.getOne)
router.post('/', todoController.createTodo)
router.put('/:id', todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)

module.exports = router