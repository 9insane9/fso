import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { like, remove, getAll } from "../services/blogs"
import { useNotification } from "../hooks/useNotification"
import Comments from "./Comments"
import { useUser } from "../hooks/useUser"

const Blog = () => {
  const { showNotification } = useNotification()
  const { user } = useUser()
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAll,
  })

  const likeMutation = useMutation({
    mutationFn: like,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      showNotification("Blog liked")
    },
    onError: (e) => {
      const msg = e.response?.data?.error || e.message || "Failed to like blog"
      showNotification(msg)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      showNotification("Blog removed")
    },
    onError: (e) => {
      const msg =
        e.response?.data?.error || e.message || "Failed to remove blog"
      showNotification(msg)
    },
  })

  const handleLike = (e) => {
    e.preventDefault()
    likeMutation.mutate(blog.id)
  }

  const handleDelete = (e) => {
    e.preventDefault()
    if (window.confirm("Delete this blog?")) {
      deleteMutation.mutate(blog.id)
    }
  }

  if (isLoading) return <div>Loading...</div>

  const blog = blogs.find((b) => b.id === id)
  if (!blog) return <div>Blog not found</div>

  return (
    <div
      className="blogContainer"
      data-testid="blog-container"
    >
      <div className="blogData">
        <a
          className="blogUrl"
          href={blog.url}
        >
          {blog.title}
        </a>
        {blog.user.username === user.username && (
          <button onClick={handleDelete}>delete</button>
        )}
        <div
          className="extraInfo"
          data-testid="extra-info"
        >
          <div className="blogLikes">
            <p>likes {blog.likes}</p>
            <button
              aria-label="like"
              onClick={handleLike}
            >
              like
            </button>
          </div>
          <p>Added by {blog.user.name}</p>
        </div>
      </div>
      <Comments
        id={id}
        comments={blog.comments}
      />
    </div>
  )
}

export default Blog
