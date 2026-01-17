const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  //init
  let maxLikes = blogs[0].likes
  let indexOfHighest = 0

  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > maxLikes) {
      maxLikes = blogs[i]
      indexOfHighest = i
    }
  }
  return blogs[indexOfHighest]
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorObjs = []

  blogs.forEach((b) => {
    const existingAuthor = authorObjs.find(
      (authorObj) => authorObj.author === b.author
    )

    if (existingAuthor) {
      existingAuthor.blogs++
    } else {
      authorObjs.push({ author: b.author, blogs: 1 })
    }
  })

  const authorWithMostBlogs = authorObjs.reduce((max, authorObj) =>
    authorObj.blogs > max.blogs ? authorObj : max
  )

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const authorObjs = []

  blogs.forEach((b) => {
    const existingAuthor = authorObjs.find(
      (authorObj) => authorObj.author === b.author
    )

    if (existingAuthor) {
      existingAuthor.likes += b.likes
    } else {
      authorObjs.push({ author: b.author, likes: b.likes })
    }
  })

  const authorWithMostLikes = authorObjs.reduce((max, authorObj) =>
    authorObj.likes > max.likes ? authorObj : max
  )

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
