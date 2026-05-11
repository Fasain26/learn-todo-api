// src/routes/auth.routes.js
const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth')
const validate = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/auth.validator')

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fasain
 *               email:
 *                 type: string
 *                 example: fasain@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 *       409:
 *         description: Email already in use
 */
router.post('/register', validate(registerSchema), authController.register)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: fasain@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), authController.login)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *       401:
 *         description: No token provided
 */
router.get('/me', protect, authController.getMe)

module.exports = router