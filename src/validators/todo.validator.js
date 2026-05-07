// src/validators/todo.validator.js
const { z } = require('zod')

const createTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be under 200 characters')
})

const updateTodoSchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be under 200 characters')
    .optional(),

  completed: z.boolean().optional()
}).refine(
  data => data.title !== undefined || data.completed !== undefined,
  { message: 'Provide at least one field to update' }
)

module.exports = { createTodoSchema, updateTodoSchema }