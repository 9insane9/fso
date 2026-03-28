import { useUser } from "../hooks/useUser"
import { Link } from "react-router-dom"

const Dashboard = () => {
  const { user, logout } = useUser()

  if (!user) {
    return (
      <div>
        <p>Not logged in</p>
      </div>
    )
  }

  return (
    <div>
      <nav>
        <Link to="/users">Users</Link>
        <Link to="/">Blogs</Link>
      </nav>
      <div className="userPanel">
        <p>Logged in as {user.name}</p>
        <button onClick={logout}>Log out</button>
      </div>
    </div>
  )
}

export default Dashboard
