import { useState, useEffect } from "react"
import personService from "./services/persons"
import Form from "./Components/Form"
import Filter from "./Components/Filter"
import People from "./Components/People"
import Message from "./Components/Message"

const App = () => {
  const [message, setMessage] = useState("")
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    personService.getAll().then((data) => setPersons(data))
  }, [])

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    //replacement path
    if (persons.map((p) => p.name).includes(newName)) {
      const replacement = `${newName} already in phonebook, replace old number with new one?`

      if (!window.confirm(replacement)) {
        return
      }

      //find existing person
      const person = persons.find((p) => p.name === newName)

      personService
        .update(person.id, { name: newName, number: newNumber })
        .then((updatedP) => {
          setPersons(persons.map((p) => (p.id === updatedP.id ? updatedP : p)))
          showMessage(`'${newName}' updated`)
          resetFields()
        })
      return
    }

    //new path
    personService
      .create({ name: newName, number: newNumber })
      .then((newPerson) => {
        setPersons(persons.concat(newPerson))
        showMessage(`'${newName}' added`)
        resetFields()
      })
  }

  const handleDelete = (id) => {
    const person = persons.find((p) => p.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) return

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== id))
        showMessage(`'${person.name}' deleted`)
      })
      .catch((err) => {
        setPersons(persons.filter((p) => p.id !== id))
        showMessage(`'${person.name}' was already removed from server`)
        return
      })
  }

  //utils
  const resetFields = () => {
    setNewName("")
    setNewNumber("")
  }

  const showMessage = (messageText) => {
    setMessage(messageText)
    setTimeout(() => {
      setMessage("")
    }, 5000)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Message text={message} />
      <Form
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <People persons={persons} search={search} handleDelete={handleDelete} />
    </div>
  )
}

export default App
