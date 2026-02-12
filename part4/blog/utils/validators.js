const validateUsername = (req, res, next) => {
  if (req.body.username.length < 3) {
    return res
      .status(400)
      .send({ error: "expected `username` to be at least 3 characters long" })
  }
  next()
}

const validatePassword = (req, res, next) => {
  if (req.body.password.length < 3) {
    return res
      .status(400)
      .send({ error: "expected `password` to be at least 3 characters long" })
  }
  next()
}

module.exports = { validateUsername, validatePassword }
