const Header = ({ course }) => (
  <header>
    <h1>{course}</h1>
  </header>
)

const Part = ({ name, exCount }) => (
  <p>
    {name} {exCount}
  </p>
)

const Content = ({ parts }) => {
  const partEls = parts.map((p) => (
    <Part key={p.partNum} name={p.name} exCount={p.exCount} />
  ))

  return <div>{partEls}</div>
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, p) => acc + p.exCount, 0)

  return <p>Number of exercises {total}</p>
}

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      { partNum: 1, name: "Fundamentals of React", exCount: 10 },
      { partNum: 2, name: "Using props to pass data", exCount: 7 },
      { partNum: 3, name: "State of a component", exCount: 14 },
    ],
  }

  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
