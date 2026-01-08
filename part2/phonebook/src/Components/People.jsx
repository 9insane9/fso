const People = ({ persons, search, handleDelete }) => {
  return (
    <div>
      <h2>Numbers</h2>
      {persons
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .map((p) => (
          <div key={p.id}>
            <p>{p.name}</p>
            <p>{p.number}</p>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        ))}
    </div>
  )
}

export default People
