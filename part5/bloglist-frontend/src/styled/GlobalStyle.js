import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: #121212;
    color: #ffffff;
    font-family: Arial, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`

export default GlobalStyle
