require("dotenv").config()
const mongoose = require("mongoose")

const connectToDatabase = require("./db")
const Author = require("./models/author")
const Book = require("./models/book")

const MONGODB_URI = process.env.MONGODB_URI

const authorsData = [
  { name: "Robert Martin", born: 1952 },
  { name: "Martin Fowler", born: 1963 },
  { name: "Fyodor Dostoevsky", born: 1821 },
  { name: "Joshua Kerievsky" },
  { name: "Sandi Metz" },
]

const booksData = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "crime"],
  },
  {
    title: "Demons",
    published: 1872,
    author: "Fyodor Dostoevsky",
    genres: ["classic", "revolution"],
  },
]

const seed = async () => {
  await connectToDatabase(MONGODB_URI)

  // reset
  await Author.deleteMany({})
  await Book.deleteMany({})
  console.log("cleared collections")

  // insert authors
  const createdAuthors = await Author.insertMany(authorsData)
  console.log("authors inserted")

  // build lookup map
  const authorMap = {}
  createdAuthors.forEach((a) => {
    authorMap[a.name] = a._id
  })

  // attach ObjectIds
  const booksWithRefs = booksData.map((b) => ({
    ...b,
    author: authorMap[b.author],
  }))

  await Book.insertMany(booksWithRefs)
  console.log("books inserted")

  await mongoose.connection.close()
  console.log("done")
}

seed().catch((err) => {
  console.error(err)
  mongoose.connection.close()
})
