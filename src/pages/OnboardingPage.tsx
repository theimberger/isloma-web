import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError, apiFetch } from '../lib/api'

interface Address {
  street?: string
  city?: string
  state: string
  zip?: string
  id: number
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const reqData: { [key: string ]: string } = { street, city, state, zip }
      Object.keys(reqData).forEach(k => { if (!reqData[k]) delete reqData[k] })
      await apiFetch<Address>('/addresses', {
        method: 'PUT',
        body: JSON.stringify(reqData),
      })
      navigate('/')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1>Welcome! Let's get you set up.</h1>
      <p>
        Add your address so we can show you your representatives. If you'd rather not share your full address,
        just your state is enough.
      </p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="onboarding-street">Street</label>
          <input
            id="onboarding-street"
            type="text"
            autoComplete="street-address"
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="onboarding-city">City</label>
          <input
            id="onboarding-city"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="onboarding-state">State</label>
          <input
            id="onboarding-state"
            type="text"
            autoComplete="address-level1"
            required
            value={state}
            onChange={(event) => setState(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="onboarding-zip">ZIP code</label>
          <input
            id="onboarding-zip"
            type="text"
            autoComplete="postal-code"
            pattern="\d{5}(-\d{4})?"
            title="5-digit ZIP code, optionally followed by a 4-digit extension"
            value={zip}
            onChange={(event) => setZip(event.target.value)}
          />
        </div>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Continue'}
        </button>
      </form>
      <p>
        <Link to="/">Skip for now</Link>
      </p>
    </>
  )
}

export default OnboardingPage
