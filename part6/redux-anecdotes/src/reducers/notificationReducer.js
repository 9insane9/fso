import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setMessage(state, action) {
      return action.payload
    },
    removeMessage(state, action) {
      return ""
    },
  },
})

const { setMessage, removeMessage } = notificationSlice.actions

export const setNotification = (msg, timeOutSeconds) => {
  return async (dispatch) => {
    dispatch(setMessage(msg))
    setTimeout(() => {
      dispatch(removeMessage())
    }, timeOutSeconds * 1000)
  }
}

export default notificationSlice.reducer
