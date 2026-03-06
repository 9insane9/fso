const { test, expect, beforeEach, describe } = require("@playwright/test")
const { loginWith, createBlog } = require("./helper")

describe("Blog app", () => {
  //reset and create users
  beforeEach(async ({ page, request }) => {
    const user1 = {
      username: "testUser",
      name: "Test User",
      password: "testUserPassword",
    }
    const user2 = {
      username: "testUser2",
      name: "Test User2",
      password: "testUserPassword",
    }
    await page.goto("/")
    await request.post("/api/testing/reset")
    await request.post("/api/users", { data: user1 })
    await request.post("/api/users", { data: user2 })
  })

  test("Login form is shown (when button clicked)", async ({ page }) => {
    const showFormBtn = page.getByText("Log in")
    await showFormBtn.click()

    await expect(page.getByLabel("username")).toBeVisible()
    await expect(page.getByLabel("password")).toBeVisible()
  })

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      //show login form
      await page.getByRole("button", { name: "Log in" }).click()

      await loginWith(page, "testUser", "testUserPassword")

      const loggedInMsg = page.getByText("logged in as Test User")

      await expect(loggedInMsg).toBeVisible()
    })

    test("fails with wrong credentials", async ({ page }) => {
      //show login form
      await page.getByRole("button", { name: "Log in" }).click()

      await loginWith(page, "testUser", "wrongPassword")

      await expect(page.getByText("logged in as Test User")).not.toBeVisible()
      await expect(page.getByText("invalid username or password")).toBeVisible()
    })
  })

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      //show login form
      await page.getByRole("button", { name: "Log in" }).click()
      await loginWith(page, "testUser", "testUserPassword")
    })

    test("user can create new blog", async ({ page }) => {
      //show blog form
      await page.getByText("create new blog").click()

      await createBlog(page, "testBlogTitle", "testBlogAuthor", "testBlogUrl")

      await expect(
        page.getByText("testBlogTitle by testBlogAuthor"),
      ).toBeVisible()
    })

    test("blogs can be liked", async ({ page }) => {
      //show blog form, create, expand
      await page.getByText("create new blog").click()
      await createBlog(page, "testBlogTitle", "testBlogAuthor", "testBlogUrl")
      await page.getByRole("button", { name: "view" }).click()

      await expect(page.getByText("likes 0")).toBeVisible()

      await page.getByRole("button", { name: "like" }).click()

      await expect(page.getByText("likes 1")).toBeVisible()
    })
  })

  describe("With multiple users who each create blogs...", () => {
    //create blogs with both users, stay logged in as testUser2
    beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "Log in" }).click()
      await loginWith(page, "testUser", "testUserPassword")
      await page.getByText("create new blog").click()
      await createBlog(
        page,
        "testBlogTitleByUser1",
        "testBlogAuthorByUser1",
        "testBlogUrlByUser1",
      )
      await page.getByRole("button", { name: "logout" }).click()

      await page.getByRole("button", { name: "Log in" }).click()
      await loginWith(page, "testUser2", "testUserPassword")
      await page.getByText("create new blog").click()
      await createBlog(
        page,
        "testBlogTitleByUser2",
        "testBlogAuthorByUser2",
        "testBlogUrlByUser2",
      )
    })

    test("only blog creator can see delete buttton", async ({ page }) => {
      const blogByUser1 = page
        .getByTestId("blog-container")
        .filter({ hasText: "testBlogTitleByUser1" })

      const blogByUser2 = page
        .getByTestId("blog-container")
        .filter({ hasText: "testBlogTitleByUser2" })

      await expect(
        blogByUser1.getByRole("button", { name: "delete" }),
      ).toHaveCount(0)

      await expect(
        blogByUser2.getByRole("button", { name: "delete" }),
      ).toBeVisible()
    })

    test("blog creator can successfully delete blog", async ({ page }) => {
      const blogByUser2 = page
        .getByTestId("blog-container")
        .filter({ hasText: "testBlogTitleByUser2" })

      page.on("dialog", async (dialog) => {
        await dialog.accept()
      })

      await blogByUser2.getByRole("button", { name: "delete" }).click()

      await expect(page.getByText("testBlogTitleByUser2")).toHaveCount(0)
    })

    describe("blogs are ordered by number of likes (descending)..", () => {
      test("most liked blog gets pushed to the top", async ({ page }) => {
        const blogByUser1 = page
          .getByTestId("blog-container")
          .filter({ hasText: "testBlogTitleByUser1" })

        const blogByUser2 = page
          .getByTestId("blog-container")
          .filter({ hasText: "testBlogTitleByUser2" })

        const blogs = page.getByTestId("blog-container")

        //after 1 like post 2 is first
        await blogByUser2.getByRole("button", { name: "view" }).click()
        await blogByUser2.getByRole("button", { name: "like" }).click()

        await expect(blogs.first()).toContainText("testBlogTitleByUser2")

        //after 2 likes post 1 is first
        await blogByUser1.getByRole("button", { name: "view" }).click()
        await blogByUser1.getByRole("button", { name: "like" }).click()
        await blogByUser1.getByRole("button", { name: "like" }).click()

        await expect(blogs.first()).toContainText("testBlogTitleByUser1")
      })
    })
  })
})
