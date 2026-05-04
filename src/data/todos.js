// src/data/todos.js
// This acts as our temporary in-memory database.
// When the server restarts, data resets. We'll fix this in Phase 3.

let todos = [
  {
    id: 1,
    title: 'Learn backend development',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Build the Todo API',
    completed: false,
    createdAt: new Date().toISOString()
  }
]

// We export a counter separately so IDs always increment
// and never repeat, even after deletions
let nextId = 3

module.exports = { todos, getNextId: () => nextId++ }