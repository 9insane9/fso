import { useUser } from "../hooks/useUser"
import { Link } from "react-router-dom"
import {
  Dash,
  UserPanel,
  Nav,
  NavLink,
  StyledLogoutIcon,
} from "../styled/Dashboard"

const Dashboard = () => {
  const { user, logout } = useUser()

  return (
    <Dash>
      <Nav>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/">Blogs</NavLink>
      </Nav>
      {!user ? (
        <div>
          <p>Not logged in</p>
        </div>
      ) : (
        <UserPanel>
          <p>Logged in as {user.name}</p>
          <button onClick={logout}>
            <StyledLogoutIcon />
          </button>
        </UserPanel>
      )}
    </Dash>
  )
}

export default Dashboard
