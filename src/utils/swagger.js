// src/utils/swagger.js
const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API',
      version: '1.0.0',
      description: 'A REST API built with Node.js, Express, PostgreSQL and Prisma'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token'
        }
      },
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Learn backend development' },
            completed: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time' },
            userId: { type: 'integer', example: 1 }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Fasain' },
            email: { type: 'string', example: 'fasain@test.com' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Something went wrong' }
          }
        }
      }
    }
  },
  // Where to look for JSDoc comments
  apis: ['./src/routes/*.js']
}

servers: [
  {
    url: 'http://localhost:3000',
    description: 'Development server'
  },
  {
    url: 'https://learn-todo-api-production.up.railway.app',
    description: 'Production server'
  }
]

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec