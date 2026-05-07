const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createTodoSchema, updateTodoSchema } = require('../validators/todo.validator')

router.use(protect)

router.get('/', todoController.getAll)
router.get('/:id', todoController.getOne)
router.post('/', validate(createTodoSchema), todoController.createTodo)
router.put('/:id', validate(updateTodoSchema), todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)

module.exports = router