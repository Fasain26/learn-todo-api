// src/middleware/validate.js
const { z } = require('zod')
const AppError = require('../utils/AppError')

const validate = (schema) => {
  return (req, res, next) => {
    try {
      // Parse and validate — also strips unknown fields
      const parsed = schema.parse(req.body)

      // Replace req.body with the validated, cleaned data
      req.body = parsed

      next()
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Format Zod errors into a readable structure
        const errors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message
        }))

        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors
        })
      }
      next(err)
    }
  }
}

module.exports = validate