import { useField } from "../hooks/useField"
import { useUser } from "../hooks/useUser"

const LoginForm = () => {
  const username = useField("text")
  const password = useField("password")
  const { login } = useUser()

  const handleLogin = async (e) => {
    e.preventDefault()
    await login({
      username: username.inputProps.value,
      password: password.inputProps.value,
    })
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          {...username.inputProps}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          {...password.inputProps}
        />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
