import { useQuery } from "@apollo/client/react"
import { ALL_GENRES } from "../queries"

const Filter = ({ selectedGenres, setSelectedGenres }) => {
  const genresResult = useQuery(ALL_GENRES)

  const genres = genresResult.data?.allGenres ?? []

  const reset = () => {
    setSelectedGenres([])
  }

  const toggleGenre = (genreName) => {
    if (selectedGenres.includes(genreName)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreName))
      return
    }
    setSelectedGenres(selectedGenres.concat(genreName))
  }

  return (
    <div>
      <button onClick={reset}>all genres</button>

      {genres.map((g) => {
        const isSelected = selectedGenres.includes(g)

        return (
          <button
            key={g}
            onClick={() => toggleGenre(g)}
            style={{
              marginRight: 5,
              backgroundColor: isSelected ? "black" : "white",
              color: isSelected ? "white" : "black",
              border: "1px solid black",
            }}
          >
            {g}
          </button>
        )
      })}
    </div>
  )
}

export default Filter
