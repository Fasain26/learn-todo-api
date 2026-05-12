// src/tests/setup.js
const { execSync } = require('child_process')

// Before all tests — migrate the test database
beforeAll(async () => {
  process.env.DATABASE_URL = process.env.DATABASE_TEST_URL
  execSync('npx prisma migrate deploy', { stdio: 'inherit' })
})

// After all tests — clean up
afterAll(async () => {
  const prisma = require('../utils/prisma')
  await prisma.$disconnect()
})