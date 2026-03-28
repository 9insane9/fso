import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getUsers } from "../services/users"

const User = () => {
  const { username } = useParams()

  const {
    data: users,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading users</div>

  const user = users.find((u) => u.username === username)

  if (!user) return <div>User not found</div>

  return (
    <div>
      <h2>{user.name}</h2>

      <h3>Added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default User
