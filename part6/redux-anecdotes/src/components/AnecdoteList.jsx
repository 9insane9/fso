import { useSelector, useDispatch } from "react-redux"
import { vote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "") {
      return anecdotes
    }
    return anecdotes.filter((a) =>
      a.content.toLowerCase().includes(filter.toLowerCase()),
    )
  })

  const voteForJoke = (id) => {
    dispatch(vote(id))

    //notification
    const joke = anecdotes.find((a) => a.id === id)
    const msg = `Voted for: "${joke.content}"`
    dispatch(setNotification(msg, 5))
  }

  return (
    <div>
      {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => voteForJoke(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  )
}

export default AnecdoteList
