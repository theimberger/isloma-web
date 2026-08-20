import { Route, Routes } from 'react-router-dom'
import RequireAuth from './components/RequireAuth'
import AccountPage from './pages/AccountPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route
        path="/onboarding"
        element={
          <RequireAuth>
            <OnboardingPage />
          </RequireAuth>
        }
      />
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
