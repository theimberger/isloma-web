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

interface Bill {
  id: number
  congress: number
  type: string
  number: string
  title: string
  latestActionDate: string | null
  latestActionText: string | null
}

interface HomeData {
  congressPeople: CongressPerson[]
  bills: Bill[]
}

function HomeContent() {
  const [data, setData] = useState<HomeData | null>(null)
  const [error, setError] = useState('')
  const [needsAddress, setNeedsAddress] = useState(false)

  useEffect(() => {
    apiFetch<HomeData>('/home')
      .then(setData)
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

  if (!data) {
    return <p>Loading…</p>
  }

  return (
    <>
      <h2>Your representatives</h2>
      <ul>
        {data.congressPeople.map((person) => (
          <li key={person.id}>
            {person.imageUrl && (
              <img src={person.imageUrl} alt="" width={48} height={48} />
            )}
            {person.firstName} {person.lastName} ({person.party}) —{' '}
            {person.chamber === 'senate' ? 'Senate' : `House, District ${person.district}`}
          </li>
        ))}
      </ul>

      <h2>Recent bills</h2>
      {data.bills.length === 0 ? (
        <p>No recent bills.</p>
      ) : (
        <ul>
          {data.bills.map((bill) => (
            <li key={bill.id}>
              {bill.type} {bill.number} ({bill.congress}th Congress) — {bill.title}
              {bill.latestActionText && (
                <>
                  {' '}
                  — {bill.latestActionText}
                  {bill.latestActionDate && ` (${bill.latestActionDate})`}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
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
      {isLoggedIn && <HomeContent />}
    </>
  )
}

export default HomePage
