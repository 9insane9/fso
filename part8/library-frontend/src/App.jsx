import { useState } from "react"
import { ToastContainer, toast } from "react-toastify"
import {
  useApolloClient,
  useQuery,
  useSubscription,
} from "@apollo/client/react"
import { BOOK_ADDED } from "./queries"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import Recommendations from "./components/Recommendations"

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(localStorage.getItem("books-user-token"))
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const book = data?.data?.bookAdded
      if (!book) return

      toast(`New book: ${book.title} by ${book.author.name}`)
      client.resetStore()
    },
  })

  const onLogout = async () => {
    setToken(null)
    localStorage.clear()
    await client.resetStore()
    toast.success("beep boop, logged out")
  }

  return (
    <div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
      />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>

        {token ? (
          <>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={onLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <LoginForm
        show={page === "login"}
        setToken={setToken}
      />

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <Recommendations show={page === "recommend"} />
    </div>
  )
}

export default App
