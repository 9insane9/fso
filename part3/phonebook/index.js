require("dotenv").config()

const express = require("express")
const Person = require("./models/person")
const requestLogger = require("./utils/requestLogger")
const errorHandler = require("./utils/errorHandler")

const app = express()
app.use(express.json())
app.use(express.static("dist"))
app.use(requestLogger)

///GET
app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((persons) => {
      res.json(persons)
    })
    .catch((err) => next(err))
})

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      person ? res.json(person) : res.status(404).end()
    })
    .catch((err) => next(err))
})

///POST
app.post("/api/persons", (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((err) => next(err))
})

//UPDATE
app.put("/api/persons/:id", (req, res, next) => {
  const { name, number } = req.body

  Person.findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((err) => next(err))
})

///DELETE
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

///INFO
app.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    const info = `Phonebook as info for ${persons.length} people <br><br>
  ${new Date()}`

    res.send(info)
  })
})

app.use(errorHandler)

///LISTEN
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
