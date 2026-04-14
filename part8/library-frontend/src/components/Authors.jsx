import { ALL_AUTHORS, UPDATE_BIRTHYEAR } from "../queries"
import { useState } from "react"
import { useQuery, useMutation } from "@apollo/client/react"
import { toast } from "react-toastify"

const Authors = ({ show }) => {
  const [selectedAuthor, setSelectedAuthor] = useState("")
  const [birthYear, setBirthYear] = useState("")

  const result = useQuery(ALL_AUTHORS)
  const [updateBirthyear] = useMutation(UPDATE_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
    onCompleted: () => {
      toast.success("Birthyear updated successfully!")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const updateAuthor = (e) => {
    e.preventDefault()
    if (!selectedAuthor) return

    updateBirthyear({ variables: { name: selectedAuthor, born: birthYear } })

    setSelectedAuthor("")
    setBirthYear("")
  }

  const handleSelectChange = (e) => {
    const selected = e.target.value
    setSelectedAuthor(selected)
    const author = result.data.allAuthors.find((a) => a.name === selected)
    setBirthYear(author?.born ?? "")
  }

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <form onSubmit={updateAuthor}>
        <h2>Set birthyear</h2>
        <label htmlFor="name">name</label>
        <select
          name="author"
          id="name"
          onChange={handleSelectChange}
          value={selectedAuthor}
        >
          <option
            value=""
            disabled
          >
            Select author...
          </option>
          {result.data.allAuthors.map((a) => (
            <option
              key={a.id}
              value={a.name}
            >
              {a.name}
            </option>
          ))}
        </select>
        <label htmlFor="year">born</label>
        <input
          type="number"
          id="year"
          value={birthYear}
          onChange={(e) => setBirthYear(Number(e.target.value))}
        />
        <button>update author</button>
      </form>
    </div>
  )
}

export default Authors
