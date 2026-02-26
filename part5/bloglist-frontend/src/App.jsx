import { useState, useEffect } from "react"
import blogService from "./services/blogs"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import Dashboard from "./components/Dashboard"
import BlogForm from "./components/BlogForm"

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      const sorted = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(sorted)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // console.log(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logOut = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    setUser(null)
    showMessage("Successfully logged out")
  }

  const addBlog = async (blogObject) => {
    //try, catch?
    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog)) //better to refetch?

    if (returnedBlog) {
      showMessage("Blog added")
    }

    if (!returnedBlog) {
      showMessage("Failed to add blog")
    }
  }

  const likeBlog = async (id) => {
    //try, catch?
    const returnedBlog = await blogService.like(id)

    setBlogs(
      blogs
        .map((blog) =>
          blog.id === id ? { ...blog, likes: returnedBlog.likes } : blog,
        )
        .sort((a, b) => b.likes - a.likes),
    )
  }

  const removeBlog = async (id) => {
    if (window.confirm("delete this blog?")) await blogService.remove(id) //right?

    setBlogs(
      blogs.filter((blog) => blog.id !== id).sort((a, b) => b.likes - a.likes),
    )
  }

  const showMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage("")
    }, 3000)
  }

  return (
    <div>
      <h2>blogs</h2>

      {message && (
        <p
          className="message"
          style={{
            color: "red",
            fontSize: "24px",
            fontWeight: "bold",
            border: "2px solid green",
          }}
        >
          {message}
        </p>
      )}

      <Dashboard
        user={user}
        logOut={logOut}
      />

      {!user && (
        <LoginForm
          setUser={setUser}
          showMessage={showMessage}
        />
      )}

      {user && (
        <BlogForm
          createBlog={addBlog}
          showMessage={showMessage}
        />
      )}

      {user &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            like={likeBlog}
            remove={removeBlog}
            username={user.username}
          />
        ))}
    </div>
  )
}

export default App
