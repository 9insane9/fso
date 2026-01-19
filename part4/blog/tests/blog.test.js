const assert = require("node:assert")
const { test, after, beforeEach, describe } = require("node:test")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const supertest = require("supertest")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

//  probably better to compare to data in db, not use initialBlogs
//  like course suggests

describe("when there are some blogs saved", () => {
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

  test("correct amount of blogs get added", async () => {
    const result = await api.get("/api/blogs")
    assert.strictEqual(helper.initialBlogs.length, result.body.length)
  })

  test("can get specific blog based on id", async () => {
    const testBlog = {
      title: "specificTest",
      author: "specificTest",
      url: "specificTest",
      likes: 0,
    }

    const sentBlog = await api.post("/api/blogs/").send(testBlog).expect(201)
    const requestedBlog = await api.get(`/api/blogs/${sentBlog.body.id}`)

    assert.strictEqual(requestedBlog.body.title, sentBlog.body.title)
  })

  describe("on creation...", async () => {
    test("blog gets posted successfully", async () => {
      const testBlog = {
        title: "postTest",
        author: "postTest",
        url: "postTest",
        likes: 0,
      }

      const initialBlogs = await helper.blogsInDb()
      const result = await api.post("/api/blogs").send(testBlog).expect(201)
      const finalBlogs = await helper.blogsInDb()

      const finalAmount = finalBlogs.length
      const initialAmount = initialBlogs.length

      assert.strictEqual(finalAmount, initialAmount + 1)
      assert(finalBlogs.map((b) => b.title).includes(testBlog.title))
    })

    test("id property is named 'id', not '_id'", async () => {
      const result = await api.get("/api/blogs")
      assert(result.body[0].id && !result.body[0]._id)
    })

    test("if parameter 'likes' missing from request, default to zero", async () => {
      const testBlog = {
        title: "likeTest",
        author: "likeTest",
        url: "likeTest",
      }

      const result = await api.post("/api/blogs").send(testBlog).expect(201)

      assert.strictEqual(result.body.likes, 0)
    })

    test("if parameter 'title' or 'url' missing from request, respond with status 400", async () => {
      const testBlogNoTitle = {
        author: "likeTest",
        url: "likeTest",
      }

      const testBlogNoUrl = {
        title: "likeTest",
        author: "likeTest",
      }

      const result1 = await api
        .post("/api/blogs")
        .send(testBlogNoTitle)
        .expect(400)
      const result2 = await api
        .post("/api/blogs")
        .send(testBlogNoUrl)
        .expect(400)
    })
  })

  describe("on deletion...", async () => {
    test("existing blog gets deleted correctly", async () => {
      const testBlog = {
        title: "deleteTest",
        author: "deleteTest",
        url: "deleteTest",
        likes: 0,
      }

      const addedBlog = await api.post("/api/blogs").send(testBlog).expect(201)
      const blogsAfterAdding = await helper.blogsInDb()
      const id = addedBlog.body.id

      const deletion = await api.delete(`/api/blogs/${id}`).expect(204)
      const finalBlogs = await helper.blogsInDb()

      assert.ok(blogsAfterAdding.some((b) => b.id === id))
      assert.ok(!finalBlogs.some((b) => b.id === id))
    })

    test("invalid id reports responds with status 400", async () => {
      await api
        .delete("/api/blogs/inamedmychildafteraspellineldenring")
        .expect(400)
    })

    test("if valid id, but blog does not exist in db, responds with status 404", async () => {
      const validId = await helper.nonExistingId()

      await api.delete(`/api/blogs/${validId}`).expect(404)
    })
  })

  describe("on update...", async () => {
    test("likes can be updated", async () => {
      const newBlog = {
        title: "updateTest",
        author: "updateTest",
        url: "updateTest",
        likes: 0,
      }

      const created = await api.post("/api/blogs").send(newBlog).expect(201)

      const updatedBlog = {
        ...created.body,
        likes: created.body.likes + 1,
      }

      const result = await api
        .put(`/api/blogs/${created.body.id}`)
        .send(updatedBlog)

      assert.strictEqual(result.body.likes, 1)
    })
  })
})
