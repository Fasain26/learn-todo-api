# Todo API

A production-ready REST API built with Node.js, Express, PostgreSQL and Prisma.
Features JWT authentication, input validation, pagination, rate limiting, and interactive API documentation.

> **Live API:** Coming soon
> **API Docs:** Coming soon

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| PostgreSQL | Database |
| Prisma | ORM + migrations |
| JWT + bcryptjs | Authentication |
| Zod | Input validation |
| Swagger UI | API documentation |
| Helmet | Security headers |
| express-rate-limit | Rate limiting |

## Features

- JWT authentication (register, login, protected routes)
- User-scoped data (users only see their own todos)
- Full CRUD operations on todos
- Pagination with metadata (page, limit, totalPages, hasNextPage)
- Input validation with detailed error messages per field
- Centralized error handling with dev/production modes
- Request logging with method, URL, status code, and duration
- Security headers via Helmet
- Rate limiting (auth: 10 req/15min — general: 100 req/15min)
- Interactive API documentation via Swagger UI

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v15 or higher
- npm v9 or higher

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/todo-api.git
cd todo-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/tododb
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRES_IN=7d
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the development server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 6. Open API documentation

```
http://localhost:3000/api-docs
```

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register a new account | No |
| POST | /auth/login | Login, returns JWT token | No |
| GET | /auth/me | Get current user profile | Yes |

### Todos

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/todos | Get all todos (paginated) | Yes |
| GET | /api/todos/:id | Get a single todo | Yes |
| POST | /api/todos | Create a new todo | Yes |
| PUT | /api/todos/:id | Update a todo | Yes |
| DELETE | /api/todos/:id | Delete a todo | Yes |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | API status |
| GET | /health | Health check |

## Pagination

Add query parameters to `GET /api/todos`:

```
GET /api/todos?page=1&limit=10
```

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| page | integer | 1 | — | Page number |
| limit | integer | 10 | 100 | Items per page |

### Pagination response

```json
{
  "status": "success",
  "data": [],
  "pagination": {
    "total": 47,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Response Format

### Success

```json
{
  "status": "success",
  "data": {}
}
```

### Error

```json
{
  "status": "error",
  "message": "Something went wrong"
}
```

### Validation error

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Invalid email format" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}
```

## Authentication

This API uses JWT Bearer Token authentication.

### How to authenticate

1. Register or login to receive a token
2. Include the token in the `Authorization` header of every protected request:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

### Token expiry

Tokens expire after 7 days. Login again to get a new token.

## Project Structure

```
todo-api/
├── src/
│   ├── app.js                  ← entry point, wires everything together
│   ├── controllers/            ← business logic
│   │   ├── auth.controller.js
│   │   └── todo.controller.js
│   ├── middleware/             ← express middleware
│   │   ├── auth.js             ← JWT verification
│   │   ├── errorHandler.js     ← global error handler
│   │   ├── logger.js           ← request logger
│   │   └── validate.js         ← zod validation wrapper
│   ├── routes/                 ← URL mapping
│   │   ├── auth.routes.js
│   │   └── todo.routes.js
│   ├── utils/                  ← shared utilities
│   │   ├── AppError.js         ← custom error class
│   │   ├── prisma.js           ← prisma client instance
│   │   └── swagger.js          ← swagger configuration
│   └── validators/             ← zod schemas
│       ├── auth.validator.js
│       └── todo.validator.js
├── prisma/
│   ├── schema.prisma           ← database schema
│   └── migrations/             ← migration history
├── .env                        ← secrets (never committed)
├── .env.example                ← template for environment variables
├── .gitignore
└── package.json
```

## Scripts

```bash
npm run dev      # start development server with auto-reload
npm start        # start production server
```

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens signed with a secret key
- Security headers added via Helmet
- Rate limiting on all routes
- Stricter rate limiting on auth endpoints
- Environment variables for all secrets
- Error details hidden in production mode
- User-scoped data access (users cannot access other users' data)

## Error Handling

The API uses a centralized error handling system with two modes:

**Development** — full error details including stack trace for debugging

**Production** — safe error messages only, internal details never exposed

## License

MIT
