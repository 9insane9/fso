import { useUser } from "../hooks/useUser"

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
      <p>Logged in as {user.name}</p>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

export default Dashboard
