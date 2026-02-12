const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")
const { validateUsername, validatePassword } = require("../utils/validators")

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).populate("blogs", {
      title: 1,
      author: 1,
      url: 1,
      likes: 1,
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

usersRouter.post(
  "/",
  validateUsername,
  validatePassword,
  async (req, res, next) => {
    try {
      const { username, name, password } = req.body

      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash,
      })

      const savedUser = await user.save()
      res.status(201).json(savedUser)
    } catch (err) {
      next(err)
    }
  },
)

module.exports = usersRouter
