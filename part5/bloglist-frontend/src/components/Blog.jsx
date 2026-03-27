import { useQueryClient, useMutation } from "@tanstack/react-query"
import { like, remove } from "../services/blogs"
import { useNotification } from "../hooks/useNotification"
import { useUser } from "../hooks/useUser"

const Blog = ({ blog }) => {
  const { showNotification } = useNotification()
  const { user } = useUser()
  const queryClient = useQueryClient()

  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleLike = async (e) => {
    e.preventDefault()
    await likeMutation.mutate(blog.id)
  }

  const handleDelete = async (e) => {
    e.preventDefault()
    if (window.confirm("delete this blog?")) {
      await deleteMutation.mutate(blog.id)
    }
  }

  const likeMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      showNotification("Blog liked")
    },
    onError: (e) => {
      const errorMessage =
        e.response?.data?.error || e.message || "Failed to like blog"

      showNotification(errorMessage)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      showNotification("Blog removed")
    },
    onError: (e) => {
      const errorMessage =
        e.response?.data?.error || e.message || "Failed to remove blog"

      showNotification(errorMessage)
    },
  })

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
        {blog.user.username === user.username && (
          <button onClick={handleDelete}>delete</button>
        )}
        <div
          className="extraInfo"
          data-testid="extra-info"
        >
          <p className="blogUrl">{blog.url}</p>
          <div className="blogLikes">
            <p>likes {blog.likes}</p>
            <button
              aria-label="like"
              onClick={handleLike}
            >
              like
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
