require("dotenv").config()
const mongoose = require("mongoose")

mongoose.set("strictQuery", false)

mongoose
  .connect(process.env.URL, { family: 4 })
  .then((res) => {
    console.log("Connected successfully!")
  })
  .catch((err) => {
    console.log("Error connecting to DB:", err.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
