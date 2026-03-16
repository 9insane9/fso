import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useContext } from 'react'
import { getAll, voteFor } from './services/anecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './context/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()
  const { showNotification } = useContext(NotificationContext)

  const handleVote = (anecdote) => {
    console.log('vote')
    voteMutation.mutate(anecdote.id)
    const msg = `voted for "${anecdote.content}"`
    showNotification(msg)
  }

  const anecdotes = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1,
  })

  const voteMutation = useMutation({
    mutationFn: voteFor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    },
    onError: (e) => {
      showNotification(e.message)
    },
  })

  // console.log(JSON.parse(JSON.stringify(anecdotes)))

  if (anecdotes.isLoading) {
    return <div>loading anecdotes...</div>
  }

  if (anecdotes.isError) {
    return <div>something borked with the server...</div>
  }

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.data.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
