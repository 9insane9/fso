import { useQuery } from "@tanstack/react-query"
import { getAll } from "../services/blogs"
import Blog from "./Blog"
import BlogForm from "./BlogForm"

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
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  )
}

export default BlogList
