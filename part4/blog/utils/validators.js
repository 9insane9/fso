const validateUsername = (req, res, next) => {
  if (req.body.username.length < 3) {
    return res
      .status(400)
      .send({ error: "Username must be at least 3 characters long" })
  }
  next()
}

const validatePassword = (req, res, next) => {
  if (req.body.password.length < 3) {
    return res
      .status(400)
      .send({ error: "Password must be at least 3 characters long" })
  }
  next()
}

const validateName = (req, res, next) => {
  const name = req.body.name

  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      error: "Name is required (doesn't have to be a real one, though)",
    })
  }

  next()
}

module.exports = { validateUsername, validatePassword, validateName }
