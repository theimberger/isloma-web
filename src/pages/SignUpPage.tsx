import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, apiFetch } from '../lib/api'
import { setToken } from '../lib/auth'

function SignUpPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const { token } = await apiFetch<{ token: string }>('/auth/register', {
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
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="signup-email">Email</label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-password">Password</label>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="signup-confirm-password">Confirm password</label>
          <input
            id="signup-confirm-password"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing up…' : 'Sign up'}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </>
  )
}

export default SignUpPage
