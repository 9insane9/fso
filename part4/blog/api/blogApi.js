const express = require("express")
const Blog = require("../models/blog")
const User = require("../models/user")
const { userExtractor } = require("../utils/middleware")

const blogRouter = express.Router()

// GET
blogRouter.get("/", async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 })
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

blogRouter.get("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("user", {
      username: 1,
      name: 1,
    })

    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    res.json(blog)
  } catch (err) {
    next(err)
  }
})

// LIKING A BLOG
blogRouter.put("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    blog.likes = blog.likes + 1
    const updatedBlog = await blog.save()
    res.json(updatedBlog)
  } catch (err) {
    next(err)
  }
})

// POST
blogRouter.post("/", userExtractor, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    const blog = new Blog({
      ...req.body,
      likes: req.body.likes ?? 0,
      user: user._id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    const populatedBlog = await savedBlog.populate("user", {
      username: 1,
      name: 1,
    })

    res.status(201).json(populatedBlog)
  } catch (err) {
    next(err)
  }
})

// DELETE
blogRouter.delete("/:id", userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ error: "blog not found" })
    }

    if (blog.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "only author can delete blogs" })
    }

    await blog.deleteOne()
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

module.exports = blogRouter
