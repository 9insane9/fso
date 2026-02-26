const Dashboard = ({ user, logOut }) => {
  if (!user) {
    return <p>Not logged in</p>
  }

  return (
    <div>
      <p>logged in as {user.name}</p>
      <button onClick={logOut}>logout</button>
    </div>
  )
}

export default Dashboard
