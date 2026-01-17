const express = require("express")
const Blog = require("../models/blog")

const apiRouter = express.Router()

apiRouter.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

apiRouter.post("/blogs", async (req, res, next) => {
  try {
    const savedBlog = await new Blog(req.body).save()

    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = apiRouter
