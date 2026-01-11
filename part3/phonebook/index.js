const express = require("express")
const randomId = require("./generateId")
let persons = require("./persons")
const morgan = require("morgan")

const app = express()
app.use(express.json())
app.use(express.static("dist"))

morgan.token("body", (req) => JSON.stringify(req.body))
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
)

///GET
app.get("/api/persons", (req, res) => {
  res.send(persons)
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = persons.find((p) => p.id === id)

  if (!person) {
    return res.status(404).send("Not found")
  }

  res.send(person)
})

///POST

app.post("/api/persons", (req, res) => {
  const alreadyExists = persons.find((p) => p.name === req.body.name)
  const nameOrNumberMissing = !req.body.name || !req.body.number

  if (alreadyExists) {
    res.status(400).send({ error: "already exists in phonebook" })
  }

  if (nameOrNumberMissing) {
    res.status(400).send({ error: "missing name or number" })
  }

  const person = {
    id: randomId(),
    name: req.body.name,
    number: req.body.number,
  }

  persons = persons.concat(person)

  res.status(201).send(person)
})

///DELETE
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id

  if (!persons.find((p) => p.id === id)) {
    return res.status(404).send("Not found")
  }

  persons = persons.filter((p) => p.id !== id)
  res.status(204)
})

///INFO
app.get("/info", (req, res) => {
  const info = `Phonebook as info for ${persons.length} people \n \n
  ${new Date()}`

  res.send(info)
})

///LISTEN
const PORT = process.env.PORT || 3001

app.listen(3001, () => {
  console.log(`App listening on port ${PORT}`)
})
