import { Routes, Route, useMatch, useNavigate } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicOnlyRoute from "./routes/PublicOnlyRoute"
import BlogList from "./components/BlogList"
import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import Dashboard from "./components/Dashboard"
import Users from "./components/Users"
import User from "./components/User"
import Notification from "./components/Notification"
import RegisterForm from "./components/Register"
import { ToastContainer } from "react-toastify"

const App = () => {
  return (
    <div>
      <h2>SuperBadassBlog</h2>
      {/* <Notification /> */}
      <ToastContainer
        autoClose={3000}
        hideProgressBar={true}
        theme="dark"
      />
      <Dashboard />
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<BlogList />}
          />
          <Route
            path="/blogs/:id"
            element={<Blog />}
          />
          <Route
            path="/users"
            element={<Users />}
          />
          <Route
            path="/users/:username"
            element={<User />}
          />
        </Route>
        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={<LoginForm />}
          />
          <Route
            path="/register"
            element={<RegisterForm />}
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
