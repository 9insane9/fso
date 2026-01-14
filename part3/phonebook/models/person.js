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
  name: { type: String, minLength: 3 },
  number: {
    type: String,
    minLength: 8,
    validate: {
      //key
      validator: function (v) {
        return /^(?:\d{2}-\d{6}|\d{3}-\d{5,})$/.test(v)
      },
      message: "Invalid phone number format",
    },
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
