import { Routes, Route, useMatch, useNavigate } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import PublicOnlyRoute from "./routes/PublicOnlyRoute"
import BlogList from "./components/BlogList"
import LoginForm from "./components/LoginForm"
import Dashboard from "./components/Dashboard"
import Notification from "./components/Notification"

const App = () => {
  return (
    <div>
      <h2>SuperBadassBlog</h2>

      <Notification />
      <Dashboard />

      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={<BlogList />}
          />
        </Route>
        <Route element={<PublicOnlyRoute />}>
          <Route
            path="/login"
            element={<LoginForm />}
          />
        </Route>
      </Routes>
    </div>
  )
}

export default App
