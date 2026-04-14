import { gql } from "@apollo/client"

export const ME = gql`
  query me {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const RECOMMENDED = gql`
  query {
    recommended {
      id
      title
      author {
        name
      }
      published
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks($genres: [String!]) {
    allBooks(genres: $genres) {
      title
      author {
        name
      }
      published
      id
    }
  }
`

export const ALL_GENRES = gql`
  query {
    allGenres
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
        born
      }
      published
      genres
      id
    }
  }
`

export const UPDATE_BIRTHYEAR = gql`
  mutation updateBirthyear($name: String!, $born: Int!) {
    editAuthor(name: $name, born: $born) {
      name
      born
    }
  }
`

export const CREATE_USER = gql`
  mutation createUser($username: String!, $favoriteGenre: String!) {
    createUser(username: $username, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      id
      title
      published
      genres
      author {
        name
        born
      }
    }
  }
`
