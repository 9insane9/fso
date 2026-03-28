import { useQuery } from "@tanstack/react-query"
import { getAll } from "../services/blogs"
import BlogForm from "./BlogForm"
import { Link } from "react-router-dom"

const BlogList = () => {
  const { data: blogs = [] } = useQuery({
    queryKey: ["blogs"],
    queryFn: getAll,
    retry: 1,
    select: (data) => [...data].sort((a, b) => b.likes - a.likes),
  })

  return (
    <div>
      <BlogForm />
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BlogList
