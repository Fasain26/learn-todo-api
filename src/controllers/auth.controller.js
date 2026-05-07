// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const prisma = require('../utils/prisma')
const AppError = require('../utils/AppError')

// Helper — creates a signed JWT token for a user
const signToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )
}

// POST /auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400)
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters', 400)
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      throw new AppError('Email already in use', 409)
    }

    // Hash the password — never store plain text
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create the user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    // Generate token
    const token = signToken(user.id)

    // Never send password back — even hashed
    const { password: _, ...userWithoutPassword } = user

    res.status(201).json({
      status: 'success',
      token,
      data: userWithoutPassword
    })
  } catch (err) {
    next(err)
  }
}

// POST /auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Email and password are required', 400)
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    // Don't tell attacker whether email or password was wrong
    // Always say "invalid credentials" — not "email not found"
    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    // Compare password with stored hash
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Invalid credentials', 401)
    }

    // Generate token
    const token = signToken(user.id)

    const { password: _, ...userWithoutPassword } = user

    res.status(200).json({
      status: 'success',
      token,
      data: userWithoutPassword
    })
  } catch (err) {
    next(err)
  }
}

// GET /auth/me
const getMe = async (req, res, next) => {
  try {
    // req.user is attached by auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
        // password intentionally excluded
      }
    })

    res.status(200).json({
      status: 'success',
      data: user
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, getMe }