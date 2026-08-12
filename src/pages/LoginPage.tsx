import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, apiFetch } from '../lib/api'
import { setToken } from '../lib/auth'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const { token } = await apiFetch<{ token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setToken(token)
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </>
  )
}

export default LoginPage
