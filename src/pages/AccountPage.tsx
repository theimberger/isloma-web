import { useEffect, useState } from 'react'
import { ApiError, apiFetch } from '../lib/api'

interface Account {
  id: number
  email: string
  username: string | null
}

function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [username, setUsername] = useState('')
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    apiFetch<Account>('/account')
      .then((data) => {
        setAccount(data)
        setUsername(data.username ?? '')
      })
      .catch((err) => {
        setLoadError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
      })
  }, [])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaveError('')
    setSaveSuccess(false)
    setIsSubmitting(true)

    try {
      const updated = await apiFetch<Account>('/account/username', {
        method: 'PUT',
        body: JSON.stringify({ username }),
      })
      setAccount(updated)
      setSaveSuccess(true)
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <>
        <h1>Account</h1>
        <p role="alert">{loadError}</p>
      </>
    )
  }

  if (!account) {
    return (
      <>
        <h1>Account</h1>
        <p>Loading…</p>
      </>
    )
  }

  return (
    <>
      <h1>Account</h1>
      <p>{account.email}</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="account-username">Username</label>
          <input
            id="account-username"
            type="text"
            autoComplete="username"
            minLength={3}
            maxLength={20}
            pattern="[a-zA-Z0-9_]+"
            title="3-20 characters: letters, numbers, and underscores only"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        {saveError && <p role="alert">{saveError}</p>}
        {saveSuccess && <p>Username updated.</p>}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save'}
        </button>
      </form>
    </>
  )
}

export default AccountPage
