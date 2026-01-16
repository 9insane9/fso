const express = require("express")
const Blog = require("../models/blog")

const apiRouter = express.Router()

apiRouter.get("/blogs", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs)
  })
})

apiRouter.post("/blogs", (req, res) => {
  const blog = new Blog(req.body)

  blog.save().then((result) => {
    res.status(201).json(result)
  })
})

module.exports = apiRouter
