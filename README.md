# Todo API

A REST API built with Node.js, Express, PostgreSQL and Prisma.

## Features
- JWT authentication (register, login)
- User-scoped todos (CRUD)
- Centralized error handling
- Request logging

## Tech Stack
- Node.js + Express
- PostgreSQL + Prisma ORM
- bcryptjs + jsonwebtoken

## Endpoints
AUTH
POST /auth/register
POST /auth/login
GET  /auth/me

TODOS (protected)
GET    /api/todos
GET    /api/todos/:id
POST   /api/todos
PUT    /api/todos/:id
DELETE /api/todos/:id

## Setup
1. Clone the repo
2. npm install
3. Copy .env.example to .env and fill in values
4. npx prisma migrate dev
5. npm run dev
