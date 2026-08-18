import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ApiError, apiFetch } from '../lib/api'
import { getToken } from '../lib/auth'

interface CongressPerson {
  id: number
  firstName: string
  lastName: string
  state: string
  chamber: string
  party: string
  district: number | null
  imageUrl: string | null
}

function CongressPeople() {
  const [congressPeople, setCongressPeople] = useState<CongressPerson[] | null>(null)
  const [error, setError] = useState('')
  const [needsAddress, setNeedsAddress] = useState(false)

  useEffect(() => {
    apiFetch<{ congressPeople: CongressPerson[] }>('/home')
      .then((data) => setCongressPeople(data.congressPeople))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setNeedsAddress(true)
          return
        }
        setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      })
  }, [])

  if (needsAddress) {
    return (
      <p>
        Add your address on your <Link to="/account">account page</Link> to see your representatives.
      </p>
    )
  }

  if (error) {
    return <p role="alert">{error}</p>
  }

  if (!congressPeople) {
    return <p>Loading…</p>
  }

  return (
    <ul>
      {congressPeople.map((person) => (
        <li key={person.id}>
          {person.imageUrl && (
            <img src={person.imageUrl} alt="" width={48} height={48} />
          )}
          {person.firstName} {person.lastName} ({person.party}) —{' '}
          {person.chamber === 'senate' ? 'Senate' : `House, District ${person.district}`}
        </li>
      ))}
    </ul>
  )
}

function HomePage() {
  const isLoggedIn = Boolean(getToken())

  return (
    <>
      <h1>isloma-web</h1>
      <p>
        <Link to="/account">Account</Link>
      </p>
      {isLoggedIn && (
        <>
          <h2>Your representatives</h2>
          <CongressPeople />
        </>
      )}
    </>
  )
}

export default HomePage
