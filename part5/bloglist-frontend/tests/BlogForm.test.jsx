import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import BlogForm from "../src/components/BlogForm"

describe("<BlogForm />", () => {
  const mockCreateBlogHandler = vi.fn()

  beforeEach(() => {
    render(<BlogForm createBlog={mockCreateBlogHandler} />)
  })

  test("correctly calls function to create new blog with appropriate data upon submission", async () => {
    const user = userEvent.setup()
    const showFormButton = screen.getByRole("button", { name: /show-form/i })

    await user.click(showFormButton)

    const titleInput = screen.getByLabelText("title")
    const authorInput = screen.getByLabelText("author")
    const urlInput = screen.getByLabelText("url")
    const createButton = screen.getByRole("button", { name: /create/i })

    await user.type(titleInput, "testTitle")
    await user.type(authorInput, "testAuthor")
    await user.type(urlInput, "testUrl")

    await user.click(createButton)

    expect(mockCreateBlogHandler.mock.calls).toHaveLength(1)
    expect(mockCreateBlogHandler.mock.calls[0][0].title).toBe("testTitle")
    expect(mockCreateBlogHandler.mock.calls[0][0].author).toBe("testAuthor")
    expect(mockCreateBlogHandler.mock.calls[0][0].url).toBe("testUrl")
  })
})
