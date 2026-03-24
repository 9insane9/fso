import { useState, useEffect, useContext } from "react"
import { useQuery } from "@tanstack/react-query"
import { getAll } from "./services/blogs"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import Dashboard from "./components/Dashboard"
import BlogForm from "./components/BlogForm"
import Notification from "./components/Notification"
import UserContext from "./context/UserContext"

const App = () => {
  const { user } = useContext(UserContext)
  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAll,
    retry: 1,
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
  })

  return (
    <div>
      <h2>blogs</h2>

      <Notification />
      <Dashboard />

      {!user && <LoginForm />}

      {user && <BlogForm />}

      {user &&
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
          />
        ))}
    </div>
  )
}

export default App
