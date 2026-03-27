import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { NotificationContextProvider } from "./context/NotificationContext"
import { UserContextProvider } from "./context/UserContext"
import { BrowserRouter as Router } from "react-router-dom"
import ReactDOM from "react-dom/client"
import App from "./App"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <NotificationContextProvider>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </UserContextProvider>
    </NotificationContextProvider>
  </Router>,
)
