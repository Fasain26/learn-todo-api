// src/tests/auth.test.js
const request = require('supertest')
const app = require('../app')
const prisma = require('../utils/prisma')

// Clean users table before each test
beforeEach(async () => {
  await prisma.todo.deleteMany()
  await prisma.user.deleteMany()
})

describe('POST /auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Fasain',
        email: 'fasain@test.com',
        password: '123456'
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.status).toBe('success')
    expect(res.body.token).toBeDefined()
    expect(res.body.data.email).toBe('fasain@test.com')
    expect(res.body.data.password).toBeUndefined() // never expose password
  })

  it('should return 400 if required fields are missing', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'fasain@test.com' }) // missing name and password

    expect(res.statusCode).toBe(400)
    expect(res.body.status).toBe('error')
  })

  it('should return 409 if email already exists', async () => {
    // Register once
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Fasain',
        email: 'fasain@test.com',
        password: '123456'
      })

    // Try to register again with same email
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Fasain',
        email: 'fasain@test.com',
        password: '123456'
      })

    expect(res.statusCode).toBe(409)
  })
})

describe('POST /auth/login', () => {
  beforeEach(async () => {
    // Create a user to login with
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Fasain',
        email: 'fasain@test.com',
        password: '123456'
      })
  })

  it('should login and return a token', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'fasain@test.com',
        password: '123456'
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it('should return 401 for wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'fasain@test.com',
        password: 'wrongpassword'
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.message).toBe('Invalid credentials')
  })

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'nobody@test.com',
        password: '123456'
      })

    expect(res.statusCode).toBe(401)
  })
})