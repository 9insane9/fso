const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course

///
const Header = ({ name }) => (
  <header>
    <h2>{name}</h2>
  </header>
)

const Part = ({ name, exercises }) => (
  <p>
    {name} {exercises}
  </p>
)

const Content = ({ parts }) => {
  const partEls = parts.map((p) => (
    <Part key={p.id} name={p.name} exercises={p.exercises} />
  ))

  return <div>{partEls}</div>
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, p) => acc + p.exercises, 0)

  return <h4>Number of exercises {total}</h4>
}
