import { useQuery } from "@apollo/client/react"
import { RECOMMENDED } from "../queries"

const Recommendations = ({ show }) => {
  // console.log("TOKEN:", localStorage.getItem("books-user-token"))
  const booksResult = useQuery(RECOMMENDED)

  if (!show) return null

  if (booksResult.loading) {
    return <div>Loading...</div>
  }

  if (booksResult.error) {
    console.log(booksResult.error)
    return <div>Error loading recommendations</div>
  }

  const books = booksResult.data?.recommended ?? []

  console.log(books)

  if (books.length === 0) {
    return <div>No recommendations in your favorite genre</div>
  }

  return (
    <div>
      <h2>recommendations</h2>

      <p>
        books in your favorite genre: <b>{}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
