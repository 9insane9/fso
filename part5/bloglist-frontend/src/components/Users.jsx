import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../services/users"
import { Link } from "react-router-dom"

const Users = () => {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    retry: 1,
  })

  if (!users) {
    return <div>Loading...</div>
  }

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.username}>
              <td>
                <Link to={`/users/${u.username}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users
