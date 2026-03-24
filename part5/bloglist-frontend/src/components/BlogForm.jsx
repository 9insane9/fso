import { useContext, useState } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import NotificationContext from "../context/NotificationContext"
import { create } from "../services/blogs"

const BlogForm = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const { showNotification } = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
    },
    onError: (e) => {
      const errorMessage =
        e.response?.data?.error || e.message || "Failed to post blog"

      showNotification(errorMessage)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const blog = { title, author, url }
    setTitle("")
    setAuthor("")
    setUrl("")
    setIsVisible(false)

    newBlogMutation.mutate(blog)
    const msg = `new blog titled "${blog.title}" created!`
    showNotification(msg)
  }

  const handleShowForm = (e) => {
    e.preventDefault()
    setIsVisible((prev) => !prev)
  }

  return (
    <div>
      {!isVisible ? (
        <button
          onClick={handleShowForm}
          aria-label="show-form"
        >
          create new blog
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>create new</h2>
          <label htmlFor="title">title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="author">author</label>
          <input
            id="author"
            type="text"
            name="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <label htmlFor="url">url</label>
          <input
            id="url"
            type="text"
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button type="submit">create</button>
          <button
            type="button"
            onClick={handleShowForm}
          >
            cancel
          </button>
        </form>
      )}
    </div>
  )
}

export default BlogForm
