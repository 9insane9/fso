import { useDispatch } from "react-redux"
import { appendAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const create = async (e) => {
    e.preventDefault()
    const content = e.target.content.value
    e.target.content.value = ""

    dispatch(appendAnecdote(content))

    //notification
    const msg = `Joke added: "${content}"`
    dispatch(setNotification(msg, 5))
  }

  return (
    <form onSubmit={create}>
      <h2>create new</h2>
      <div>
        <input name="content" />
      </div>
      <button>create</button>
    </form>
  )
}

export default AnecdoteForm
