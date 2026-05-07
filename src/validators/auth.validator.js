// src/validators/auth.validator.js
const { z } = require('zod')

const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be under 50 characters'),

  email: z.string()
    .email('Invalid email format'),

  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password too long')
})

const loginSchema = z.object({
  email: z.string()
    .email('Invalid email format'),

  password: z.string()
    .min(1, 'Password is required')
})

module.exports = { registerSchema, loginSchema }