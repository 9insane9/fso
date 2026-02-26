import { useState } from "react"
import { login } from "../services/login"
import blogService from "../services/blogs"

const LoginForm = ({ setUser, showMessage }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const handleShowForm = (e) => {
    e.preventDefault()
    setIsVisible((prev) => !prev)
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const user = await login({ username, password })

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user))

      setUser(user)
      setUsername("")
      setPassword("")

      blogService.setToken(user.token)

      showMessage("Successfully logged in")
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || err.message || "Login failed"

      showMessage(errorMessage)
    }
  }

  return (
    <div>
      {!isVisible ? (
        <button onClick={handleShowForm}>Log in</button>
      ) : (
        <form onSubmit={handleLogin}>
          <label htmlFor="username">username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
          <label htmlFor="password">password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
          <button type="submit">Login</button>
          <button
            type="button"
            onClick={handleShowForm}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  )
}

export default LoginForm
