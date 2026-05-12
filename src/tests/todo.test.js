// src/tests/todo.test.js
const request = require('supertest')
const app = require('../app')
const prisma = require('../utils/prisma')

let token  // shared across tests in this file

// Before all todo tests — create a user and get token
beforeAll(async () => {
  await prisma.todo.deleteMany()
  await prisma.user.deleteMany()

  const res = await request(app)
    .post('/auth/register')
    .send({
      name: 'Fasain',
      email: 'fasain@test.com',
      password: '123456'
    })

  token = res.body.token
})

// Clean todos before each test
beforeEach(async () => {
  await prisma.todo.deleteMany()
})

describe('GET /api/todos', () => {
  it('should return 401 without token', async () => {
    const res = await request(app).get('/api/todos')
    expect(res.statusCode).toBe(401)
  })

  it('should return empty array when no todos', async () => {
    const res = await request(app)
      .get('/api/todos')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toEqual([])
    expect(res.body.pagination).toBeDefined()
  })
})

describe('POST /api/todos', () => {
  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Learn testing' })

    expect(res.statusCode).toBe(201)
    expect(res.body.data.title).toBe('Learn testing')
    expect(res.body.data.completed).toBe(false)
  })

  it('should return 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({})

    expect(res.statusCode).toBe(400)
  })

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({ title: 'Learn testing' })

    expect(res.statusCode).toBe(401)
  })
})

describe('PUT /api/todos/:id', () => {
  it('should update a todo', async () => {
    // Create a todo first
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Original title' })

    const id = created.body.data.id

    // Update it
    const res = await request(app)
      .put(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true })

    expect(res.statusCode).toBe(200)
    expect(res.body.data.completed).toBe(true)
  })
})

describe('DELETE /api/todos/:id', () => {
  it('should delete a todo', async () => {
    const created = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Todo to delete' })

    const id = created.body.data.id

    const res = await request(app)
      .delete(`/api/todos/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(204)
  })

  it('should return 404 for non-existent todo', async () => {
    const res = await request(app)
      .delete('/api/todos/99999')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(404)
  })
})