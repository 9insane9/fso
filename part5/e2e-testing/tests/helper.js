const loginWith = async (page, username, password) => {
  await page.getByLabel("username").fill(username)
  await page.getByLabel("password").fill(password)
  await page.getByRole("button", { name: "Login" }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByLabel("title").fill(title)
  await page.getByLabel("author").fill(author)
  await page.getByLabel("url").fill(url)

  await page.getByRole("button", { name: /create/i }).click()
}

module.exports = { loginWith, createBlog }
