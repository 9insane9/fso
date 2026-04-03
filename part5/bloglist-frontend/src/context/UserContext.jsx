import {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
} from "react"
import { setToken } from "../services/blogs"
import { login } from "../services/login"
import { register } from "../services/users"
// import NotificationContext from "./NotificationContext"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()
  // const { showNotification } = useContext(NotificationContext)

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

      const msg = "Successfully logged in. "
      // showNotification(msg)
      toast.success(msg)

      return { success: true }
    } catch (error) {
      const msg =
        error.response?.data?.error || error.message || "Login failed. "
      // showNotification(msg)
      toast.error(msg)
      return { success: false }
    }
  }

  const logoutUser = () => {
    window.localStorage.removeItem("loggedBlogAppUser")
    dispatch({ type: "LOGOUT" })
    setToken(null)

    const msg = "Successfully logged out. "
    // showNotification(msg)
    toast.success(msg)
  }

  const registerUser = async (user) => {
    try {
      await register(user)

      const msg = "Successfully registered. "
      // showNotification(msg)
      toast.success(msg)

      navigate("/")

      return { success: true }
    } catch (error) {
      const msg =
        error.response?.data?.error || error.message || "Failed to register. "
      // showNotification(msg)
      toast.error(msg)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        login: loginUser,
        logout: logoutUser,
        register: registerUser,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContext
