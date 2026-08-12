import { Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<h1>isloma-web</h1>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
  )
}

export default App
