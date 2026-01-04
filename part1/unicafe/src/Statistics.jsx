const Statistics = ({ good, neutral, bad }) => {
  const totalCount = good + neutral + bad
  const average = ((good * 1 + bad * -1) / totalCount).toFixed(1)
  const positive = ((good / totalCount) * 100).toFixed(1)

  console.log(totalCount, average, positive)

  return (
    <div>
      <h1>Statistics</h1>

      {totalCount === 0 ? (
        <p>No feedback given</p>
      ) : (
        <>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={totalCount} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={positive} isPercentage />
        </>
      )}
    </div>
  )
}

export default Statistics

//helper component
const StatisticLine = ({ text, value, isPercentage = false }) => {
  return (
    <p>
      {text} {value} {isPercentage ? "%" : null}
    </p>
  )
}
