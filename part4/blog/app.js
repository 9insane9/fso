const express = require("express")
const mongoose = require("mongoose")
const config = require("./utils/config")
const blogRouter = require("./api/blogApi")
const usersRouter = require("./api/userApi")
const loginRouter = require("./api/loginApi")
const logger = require("./utils/logger")
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
} = require("./utils/middleware")

const app = express()

mongoose
  .connect(config.MONGODB_URL, { family: 4 })
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((err) => {
    logger.error("error connection to MongoDB:", err.message)
  })

app.use(express.static("dist"))
app.use(express.json())
app.use(requestLogger)
app.use(tokenExtractor)

app.use("/api/blogs", blogRouter)
app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
