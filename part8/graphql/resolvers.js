const { GraphQLError } = require("graphql")
const { PubSub } = require("graphql-subscriptions")
const jwt = require("jsonwebtoken")
const Book = require("./models/book")
const Author = require("./models/author")
const User = require("./models/user")

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (root, args) => {
      const filter = {}

      if (args.genres?.length) {
        filter.genres = { $all: args.genres }
      }

      return Book.find(filter).populate("author", { name: 1, born: 1 })
    },
    allGenres: async () => {
      const books = await Book.find({})
      return [...new Set(books.flatMap((b) => b.genres))]
    },
    allAuthors: async () => {
      // return Author.find({})
      const authors = await Author.find({})

      const counts = await Book.aggregate([
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          },
        },
      ])

      const countMap = {}
      counts.forEach((c) => {
        countMap[c._id.toString()] = c.count
      })

      return authors.map((a) => ({
        name: a.name,
        born: a.born ?? null,
        id: a._id.toString(),
        bookCount: countMap[a._id.toString()] || 0,
      }))
    },
    me: (root, args, context) => {
      return context.currentUser
    },
    recommended: async (root, args, context) => {
      const currentUser = context.currentUser

      // console.log(currentUser)

      if (!currentUser) {
        throw new GraphQLError("not authenticated (recommended)", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      return Book.find({ genres: currentUser.favoriteGenre }).populate(
        "author",
        {
          name: 1,
          born: 1,
        },
      )
    },
  },
  // Author: {
  //   bookCount: async (root) => {
  //     return Book.countDocuments({ author: root._id })
  //   },
  // },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      try {
        let author = await Author.findOne({ name: args.author })

        if (!author) {
          try {
            author = await Author.create({ name: args.author })
          } catch (err) {
            throw new GraphQLError("Author validation failed", {
              extensions: {
                code: "BAD_USER_INPUT",
                invalidArgs: args.author,
                error: err,
              },
            })
          }
        }

        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        })

        const saved = await book.save()
        const populated = await saved.populate("author", { name: 1, born: 1 })

        pubsub.publish("BOOK_ADDED", { bookAdded: populated })

        return populated
      } catch (err) {
        throw new GraphQLError(`Failed to add book:, ${err.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
            error: err,
          },
        })
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.born

      return author.save()
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      try {
        return await user.save()
      } catch (error) {
        const invalidArgs = Object.keys(error.errors || {})

        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs,
            error,
          },
        })
      }
    },
    login: async (root, args) => {
      //hardcoded password
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
}

module.exports = resolvers
