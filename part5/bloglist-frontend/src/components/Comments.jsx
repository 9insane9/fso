import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useNotification } from "../hooks/useNotification"
import { useField } from "../hooks/useField"
import { addComment } from "../services/blogs"

const Comments = ({ id, comments }) => {
  const { showNotification } = useNotification()
  const queryClient = useQueryClient()
  const author = useField("text")
  const content = useField("text")

  const commentMutation = useMutation({
    mutationFn: ({ id, comment }) => addComment(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] })
      showNotification("Comment posted!")
    },
    onError: (e) => {
      const msg =
        e.response?.data?.error || e.message || "Failed to post comment"
      showNotification(msg)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    const newComment = {
      author: author.inputProps.value || "Anonymous",
      content: content.inputProps.value,
    }

    author.reset()
    content.reset()

    commentMutation.mutate({ id, comment: newComment })
  }

  return (
    <div>
      <div className="comments">
        {!comments || comments.length === 0 ? (
          <p>Nothing here yet...</p>
        ) : (
          <ul>
            {comments.map((c) => (
              <li key={c.id}>
                <strong>{c.author}:</strong> {c.content}
              </li>
            ))}
          </ul>
        )}
      </div>
      <form
        className="commentForm"
        onSubmit={handleSubmit}
      >
        <h3>Post a comment</h3>
        <label htmlFor="author">Author: </label>
        <input
          placeholder="Anonymous"
          id="author"
          {...author.inputProps}
        />
        <label htmlFor="content">Comment: </label>
        <input
          id="content"
          {...content.inputProps}
        />
        <button>Submit</button>
      </form>
    </div>
  )
}

export default Comments
