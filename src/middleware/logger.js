// src/middleware/logger.js
const logger = (req, res, next) => {
  const start = Date.now()

  // Run after the response is finished
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`
    )
  })

  next()  // don't forget this — without it, requests hang forever
}

module.exports = logger