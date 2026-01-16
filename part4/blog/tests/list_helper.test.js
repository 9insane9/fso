const { test, describe } = require("node:test")
const assert = require("node:assert")
const listHelper = require("../utils/list_helper")

const manyBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
]

const oneBlog = [
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf",
    likes: 5,
    __v: 0,
  },
]

const noBlogs = []

test("dummy returns one", () => {
  const result = listHelper.dummy(noBlogs)
  assert.strictEqual(result, 1)
})
////
describe("total likes", () => {
  test("of empty list is zero", () => {
    const result = listHelper.totalLikes(noBlogs)
    assert.strictEqual(result, 0)
  })

  test("when list has only one blog, equals the likes of that", () => {
    const result = listHelper.totalLikes(oneBlog)
    assert.strictEqual(result, 5)
  })

  test("of a bigger list is calculated correctly", () => {
    const result = listHelper.totalLikes(manyBlogs)
    assert.strictEqual(result, 36)
  })
})
////
describe("favorite blog", () => {
  test("in an empty list is null", () => {
    const result = listHelper.favoriteBlog(noBlogs)
    assert.strictEqual(result, null)
  })

  test("in a list of one blog is that one blog", () => {
    const result = listHelper.favoriteBlog(oneBlog)
    assert.deepStrictEqual(result, oneBlog[0])
  })

  test("in a bigger list is found correctly", () => {
    const result = listHelper.favoriteBlog(manyBlogs)
    assert.deepStrictEqual(result, manyBlogs[2])
  })
})
////
describe("author most blogs", () => {
  test("in an empty list is null", () => {
    const result = listHelper.mostBlogs(noBlogs)
    assert.strictEqual(result, null)
  })

  test("in a list of one blog is the author of that blog with 1 blog", () => {
    const result = listHelper.mostBlogs(oneBlog)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", blogs: 1 })
  })

  test("in a bigger list is found correctly", () => {
    const result = listHelper.mostBlogs(manyBlogs)
    assert.deepStrictEqual(result, { author: "Robert C. Martin", blogs: 3 })
  })
})
////
describe("most likes", () => {
  test("in an empty list is null", () => {
    const result = listHelper.mostLikes(noBlogs)
    assert.strictEqual(result, null)
  })

  test("in a list of one blog is the author and likes of that blog", () => {
    const result = listHelper.mostLikes(oneBlog)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 5 })
  })

  test("in a bigger list is found correctly", () => {
    const result = listHelper.mostLikes(manyBlogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    })
  })
})
