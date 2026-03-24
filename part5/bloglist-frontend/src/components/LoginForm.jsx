import { useContext, useState } from "react"
import UserContext from "../context/UserContext"

const LoginForm = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const { login } = useContext(UserContext)

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
    await login({ username, password })
    setUsername("")
    setPassword("")
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
