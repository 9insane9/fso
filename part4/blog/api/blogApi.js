const express = require("express")
const Blog = require("../models/blog")

const apiRouter = express.Router()

apiRouter.get("/blogs", async (req, res) => {
  const blogs = await Blog.find({})
  res.json(blogs)
})

apiRouter.get("/blogs/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    res.json(blog)
  } catch (err) {
    next(err)
  }
})

apiRouter.post("/blogs", async (req, res, next) => {
  try {
    const savedBlog = await new Blog(req.body).save()

    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

apiRouter.delete("/blogs/:id", async (req, res, next) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id)

    if (!deletedBlog) {
      return res.status(404).json({ error: "blog not found" })
    }
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

apiRouter.put("/blogs/:id", async (req, res, next) => {
  try {
    const { likes } = req.body

    const blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    blog.likes = likes

    const updatedBlog = await blog.save()
    res.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

module.exports = apiRouter
