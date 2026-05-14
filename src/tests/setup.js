// src/tests/setup.js
const { execSync } = require('child_process')

beforeAll(async () => {
  // Switch to test database
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL
  process.env.NODE_ENV = 'test'

  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_TEST_URL
    }
  })
})

afterAll(async () => {
  const prisma = require('../utils/prisma')
  await prisma.$disconnect()
})