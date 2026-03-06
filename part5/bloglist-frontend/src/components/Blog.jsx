import { useState } from "react"

const Blog = ({ blog, like, remove, username }) => {
  const [isVisible, setIsVisible] = useState(false)

  console.log(`blog was made by ${blog.user.username}`)
  console.log(`logged in user is ${username}`)
  console.log(blog)

  const toggleShowMore = (e) => {
    e.preventDefault()
    setIsVisible((prev) => !prev)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    remove(blog.id)
  }

  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div
      style={blogStyle}
      className="blogContainer"
      data-testid="blog-container"
    >
      <div>
        <p>
          {blog.title} by {blog.author}
        </p>
        <button
          onClick={toggleShowMore}
          data-testid="more-btn"
        >
          {isVisible ? "hide" : "view"}
        </button>
        {blog.user.username === username && (
          <button onClick={handleDelete}>delete</button>
        )}
        {isVisible && (
          <div
            className="extraInfo"
            data-testid="extra-info"
          >
            <p className="blogUrl">{blog.url}</p>
            <div className="blogLikes">
              <p>likes {blog.likes}</p>
              <button
                aria-label="like"
                onClick={() => like(blog.id)}
              >
                like
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blog
