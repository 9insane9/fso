const assert = require("node:assert")
const { test, after, beforeEach, describe } = require("node:test")
const mongoose = require("mongoose")
const supertest = require("supertest")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const helper = require("./test_helper")
const app = require("../app")
const api = supertest(app)

//...

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", name: "testName", passwordHash })

    await user.save()
  })

  after(async () => {
    await mongoose.connection.close()
  })

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes("expected `username` to be unique"))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("can fetch list of users", async () => {
    const result = await api.get("/api/users").expect(200)

    assert(result.body.map((u) => u.username).includes("root"))
  })

  test("if username less than 3 characters long, responds with 400 and appropriate error", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "bo",
      name: "Bob Vance, Vance Refridgeration",
      password: "salainen",
    }

    const result = await api.post("/api/users").send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert(
      result.body.error.includes(
        "expected `username` to be at least 3 characters long",
      ),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test("if password less than 3 characters long, responds with 400 and appropriate error", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: "bobvance",
      name: "Bob Vance, Vance Refridgeration",
      password: "sa",
    }

    const result = await api.post("/api/users").send(newUser).expect(400)

    const usersAtEnd = await helper.usersInDb()

    assert(
      result.body.error.includes(
        "expected `password` to be at least 3 characters long",
      ),
    )

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  describe("when logging in", async () => {
    test("login successful with correct username and password", async () => {
      const user = {
        username: "root",
        password: "sekret",
      }

      const login = await api.post("/api/login").send(user).expect(200)
    })

    test("login fails with invalid username or password", async () => {
      const user = {
        username: "root",
        password: "wrongpassword",
      }

      const login = await api.post("/api/login").send(user).expect(401)
    })
  })
})
