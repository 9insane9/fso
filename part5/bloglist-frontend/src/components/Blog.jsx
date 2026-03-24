import { useContext, useState } from "react"
import { useQueryClient, useMutation } from "@tanstack/react-query"
import { like, remove } from "../services/blogs"
import NotificationContext from "../context/NotificationContext"
import UserContext from "../context/UserContext"

const Blog = ({ blog }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { showNotification } = useContext(NotificationContext)
  const { user } = useContext(UserContext)
  const queryClient = useQueryClient()
  const blogStyle = {
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  // console.log(`blog was made by ${blog.user.username}`)
  // console.log(`logged in user is ${username}`)
  // console.log(blog)

  const toggleShowMore = (e) => {
    e.preventDefault()
    setIsVisible((prev) => !prev)
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
        <button
          onClick={toggleShowMore}
          data-testid="more-btn"
        >
          {isVisible ? "hide" : "view"}
        </button>
        {blog.user.username === user.username && (
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
                onClick={handleLike}
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
