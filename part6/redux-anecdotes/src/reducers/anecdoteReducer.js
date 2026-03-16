import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload)
    },
    voteFor(state, action) {
      const updated = action.payload

      return state.map((anecdote) =>
        anecdote.id === updated.id ? updated : anecdote,
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    },
  },
})

const { setAnecdotes, createAnecdote, voteFor } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(createAnecdote(newAnecdote))
  }
}

export const vote = (id) => {
  return async (dispatch) => {
    const updatedAnecdote = await anecdoteService.voteFor(id)
    dispatch(voteFor(updatedAnecdote))
  }
}

export default anecdoteSlice.reducer
