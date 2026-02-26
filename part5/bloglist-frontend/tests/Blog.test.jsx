import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Blog from "../src/components/Blog"

describe("<Blog />", () => {
  const blog = {
    title: "blogTitle",
    author: "blogAuthorName",
    url: "blogUrl",
    likes: 0,
    user: {
      username: "blogAuthorUsername",
      name: "blogAuthorName",
      id: "698b3a6366c5a056bc2e017c",
    },
    id: "698f55a6421f6bffd29343c1",
  }

  const mockLikeHandler = vi.fn()

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        like={mockLikeHandler}
      />,
    )
  })

  test("renders only title and author name by default", async () => {
    const blogElement = screen.getByTestId("blog-container")
    const extraInfoElement = screen.queryByTestId("extra-info")

    expect(blogElement).toHaveTextContent("blogTitle")
    expect(blogElement).toHaveTextContent("blogAuthorName")
    expect(extraInfoElement).not.toBeInTheDocument()
  })

  test("renders extra info upon click of the toggle button", async () => {
    const viewButton = screen.getByText("view")
    const user = userEvent.setup()

    await user.click(viewButton)

    const extraInfoElement = screen.queryByTestId("extra-info")

    expect(extraInfoElement).toBeInTheDocument()
    expect(extraInfoElement).toHaveTextContent("blogUrl")
  })

  test(`"like" function passed from parent is called each time "like" button is pressed`, async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText("view")
    await user.click(viewButton)

    const likeButton = screen.getByRole("button", { name: /like/i })

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})
