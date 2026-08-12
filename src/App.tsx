import { Link } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import AccountPage from './pages/AccountPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function HomePage() {
  return (
    <>
      <h1>isloma-web</h1>
      <p>
        <Link to="/account">Account</Link>
      </p>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountPage />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
