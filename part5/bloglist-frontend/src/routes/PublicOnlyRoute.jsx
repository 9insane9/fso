import { Navigate, Outlet } from "react-router-dom"
import { useUser } from "../hooks/useUser"

const PublicOnlyRoute = () => {
  const { user } = useUser()

  if (user) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <Outlet />
}

export default PublicOnlyRoute
