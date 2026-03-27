import { useState } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { create } from "../services/blogs"
import { useNotification } from "../hooks/useNotification"
import { useField } from "../hooks/useField"

const BlogForm = () => {
  const title = useField("text")
  const author = useField("text")
  const url = useField("text")

  const [isVisible, setIsVisible] = useState(false)
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()

  const newBlogMutation = useMutation({
    mutationFn: create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (old) => old.concat(newBlog))
    },
    onError: (e) => {
      const errorMessage =
        e.response?.data?.error || e.message || "Failed to post blog"

      showNotification(errorMessage)
    },
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    const blog = {
      title: title.inputProps.value,
      author: author.inputProps.value,
      url: url.inputProps.value,
    }

    title.reset()
    author.reset()
    url.reset()
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
          Create new blog
        </button>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>create new</h2>
          <label htmlFor="title">Title: </label>
          <input
            id="title"
            {...title.inputProps}
          />
          <label htmlFor="author">Author: </label>
          <input
            id="author"
            {...author.inputProps}
          />
          <label htmlFor="url">Link: </label>
          <input
            id="url"
            {...url.inputProps}
          />
          <button type="submit">Create</button>
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
