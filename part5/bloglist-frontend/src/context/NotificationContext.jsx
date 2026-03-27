import { createContext, useReducer, useRef } from "react"

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload
    case "CLEAR_NOTIFICATION":
      return ""
    default:
      return state
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, dispatch] = useReducer(notificationReducer, "")
  const timeoutRef = useRef(null)

  const showNotification = (msg) => {
    dispatch({ type: "SET_NOTIFICATION", payload: msg })

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({ type: "CLEAR_NOTIFICATION" })
    }, 5000)
  }

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
