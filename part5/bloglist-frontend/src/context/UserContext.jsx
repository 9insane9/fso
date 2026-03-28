import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
} from "react"
import { setToken } from "../services/blogs"
import { login } from "../services/login"
import NotificationContext from "./NotificationContext"

const UserContext = createContext()

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload
    case "LOGOUT":
      return null
    default:
      return state
  }
}

export const UserContextProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, null)
  const [loading, setLoading] = useState(true)

  const { showNotification } = useContext(NotificationContext)

  //check if already logged in
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch({ type: "LOGIN", payload: user })
      setToken(user.token)
    }
    setLoading(false)
  }, [])

  const loginUser = async (credentials) => {
    try {
      const userData = await login(credentials)
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(userData))
      setToken(userData.token)
      dispatch({ type: "LOGIN", payload: userData })

      const msg = "successfully logged in"
      showNotification(msg)
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Login failed"
      showNotification(msg)
      return { success: false }
    }
  }

  const logoutUser = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    dispatch({ type: "LOGOUT" })
    setToken(null)

    const msg = "successfully logged out"
    showNotification(msg)
  }

  return (
    <UserContext.Provider
      value={{ user, login: loginUser, logout: logoutUser, loading }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
