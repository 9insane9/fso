const assert = require("node:assert")
const { test, after, beforeEach } = require("node:test")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

//  probably better to compare to data in db, not use initialBlogs
//  like course suggests
beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

after(async () => {
  await mongoose.connection.close()
})

test("blogs are returned as JSON", async () => {
  const result = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("correct amount of blogs", async () => {
  const result = await api.get("/api/blogs")
  assert.strictEqual(helper.initialBlogs.length, result.body.length)
})

test("id property is named 'id', not '_id'", async () => {
  const result = await api.get("/api/blogs")
  assert(result.body[0].id && !result.body[0]._id)
})

test("blog gets posted successfully", async () => {
  const testBlog = {
    title: "postTest",
    author: "postTest",
    url: "postTest",
    likes: 0,
  }

  const result = await api.post("/api/blogs").send(testBlog).expect(201)
  const finalBlogs = await helper.blogsInDb()

  const finalAmount = finalBlogs.length
  const initialAmount = helper.initialBlogs.length

  assert.strictEqual(finalAmount, initialAmount + 1)
  assert(finalBlogs.map((b) => b.title).includes(testBlog.title))
})

test("likes default to zero if missing from request", async () => {
  const testBlog = {
    title: "likeTest",
    author: "likeTest",
    url: "likeTest",
  }

  const result = await api.post("/api/blogs").send(testBlog).expect(201)

  assert.strictEqual(result.body.likes, 0)
})

test.only("server responds with 400 if request missing title or url", async () => {
  const testBlogNoTitle = {
    author: "likeTest",
    url: "likeTest",
  }

  const testBlogNoUrl = {
    title: "likeTest",
    author: "likeTest",
  }

  const result1 = await api.post("/api/blogs").send(testBlogNoTitle).expect(400)
  const result2 = await api.post("/api/blogs").send(testBlogNoUrl).expect(400)
})
