import { ALL_BOOKS } from "../queries"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"
import Filter from "./Filter"

const Books = ({ show }) => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const variables = selectedGenres.length > 0 ? { genres: selectedGenres } : {}
  const result = useQuery(ALL_BOOKS, { variables })

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {result.data.allBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Filter
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
      />
    </div>
  )
}

export default Books
