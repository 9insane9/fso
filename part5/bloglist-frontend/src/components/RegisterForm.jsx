import { useField } from "../hooks/useField"
import { Link } from "react-router-dom"
import { useUser } from "../hooks/useUser"

const RegisterForm = () => {
  const username = useField("text")
  const name = useField("text")
  const password = useField("password")
  const { register } = useUser()

  const handleRegister = async (e) => {
    e.preventDefault()
    await register({
      username: username.value,
      name: name.value,
      password: password.value,
    })
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <h2>Sign up</h2>
        <label htmlFor="username">Username: </label>
        <input
          id="username"
          {...username.inputProps}
        />
        <label htmlFor="name">Name: </label>
        <input
          id="name"
          {...name.inputProps}
        />
        <label htmlFor="password">Password: </label>
        <input
          id="password"
          {...password.inputProps}
        />
        <button type="submit">Register</button>
        <Link to="/login">Already have an account? Log in here</Link>
      </form>
    </div>
  )
}

export default RegisterForm
