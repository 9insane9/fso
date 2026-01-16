const express = require("express")
const mongoose = require("mongoose")
const config = require("./utils/config")
const apiRouter = require("./api/blogApi")
const logger = require("./utils/logger")
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware")

const app = express()

// logger.info("connecting to", config.MONGODB_URL)

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

app.use("/api", apiRouter)

app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app
