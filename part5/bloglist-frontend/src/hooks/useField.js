import { useState } from "react"

export const useField = (type) => {
  const [value, setValue] = useState("")

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const inputProps = { type, value, onChange }
  const reset = () => setValue("")

  return { inputProps, reset }
}
