const Header = ({ course }) => {
  return (
    <header>
      <h1>{course}</h1>
    </header>
  )
}

const Part = ({ name, exCount }) => {
  return (
    <p>
      {name} {exCount}
    </p>
  )
}

const Content = ({ parts }) => {
  const partEls = []

  parts.forEach((p) => {
    partEls.push(<Part name={p.name} exCount={p.exCount} />)
  })

  return <div>{partEls}</div>
}

const Total = ({ total }) => {
  return <p>Number of exercises {total}</p>
}

const App = () => {
  const course = "Half Stack application development"

  const parts = [
    { partNum: 1, name: "Fundamentals of React", exCount: 10 },
    { partNum: 2, name: "Using props to pass data", exCount: 7 },
    { partNum: 3, name: "State of a component", exCount: 14 },
  ]

  const total = parts.reduce((acc, p) => acc + p.exCount, 0)

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  )
}

export default App
