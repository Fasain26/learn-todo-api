// src/routes/todo.routes.js
const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todo.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { createTodoSchema, updateTodoSchema } = require('../validators/todo.validator')

router.use(protect)

/**
 * @swagger
 * /api/todos:
 *   get:
 *     summary: Get all todos for logged-in user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page (max 100)
 *     responses:
 *       200:
 *         description: List of todos with pagination
 *       401:
 *         description: No token provided
 */
router.get('/', todoController.getAll)

/**
 * @swagger
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo found
 *       404:
 *         description: Todo not found
 *       401:
 *         description: No token provided
 */
router.get('/:id', todoController.getOne)

/**
 * @swagger
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Learn Swagger documentation
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Validation failed
 *       401:
 *         description: No token provided
 */
router.post('/', validate(createTodoSchema), todoController.createTodo)

/**
 * @swagger
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated todo title
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Todo updated
 *       404:
 *         description: Todo not found
 *       401:
 *         description: No token provided
 */
router.put('/:id', validate(updateTodoSchema), todoController.updateTodo)

/**
 * @swagger
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 *       401:
 *         description: No token provided
 */
router.delete('/:id', todoController.deleteTodo)

module.exports = router