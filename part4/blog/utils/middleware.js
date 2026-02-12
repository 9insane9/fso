const logger = require("./logger")
const jwt = require("jsonwebtoken")

const requestLogger = (req, res, next) => {
  logger.info("Method:", req.method)
  logger.info("Path:  ", req.path)
  logger.info("Body:  ", req.body)
  logger.info("---")
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}

const tokenExtractor = (req, res, next) => {
  try {
    const auth = req.get("authorization")

    if (auth && auth.startsWith("Bearer ")) {
      req.token = auth.replace("Bearer ", "")
    } else {
      req.token = null
    }

    next()
  } catch (err) {
    next(err)
  }
}

const userExtractor = (req, res, next) => {
  try {
    if (!req.token) {
      return res.status(401).json({ error: "token missing" })
    }

    const decoded = jwt.verify(req.token, process.env.SECRET)

    req.user = decoded

    next()
  } catch (err) {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error(err.message)

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" })
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message })
  }

  if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" })
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" })
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      error: "token expired",
    })
  }

  next(err)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  tokenExtractor,
  userExtractor,
  errorHandler,
}
