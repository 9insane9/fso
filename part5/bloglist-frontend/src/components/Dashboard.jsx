import { useContext } from "react"
import UserContext from "../context/UserContext"

const Dashboard = () => {
  const { user, logout } = useContext(UserContext)

  if (!user) {
    return <p>Not logged in</p>
  }

  return (
    <div>
      <p>logged in as {user.name}</p>
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Dashboard
