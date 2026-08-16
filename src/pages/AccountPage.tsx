import { useEffect, useState } from 'react'
import { ApiError, apiFetch } from '../lib/api'

interface Address {
  street: string
  city: string
  state: string
  zip: string
  id: number;
}

interface Account {
  id: number
  email: string
  username: string | null
  address: Address | null
}

function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null)
  const [username, setUsername] = useState('')
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [addressId, setAddressId] = useState(0)
  const [addressError, setAddressError] = useState('')
  const [addressSuccess, setAddressSuccess] = useState(false)
  const [isSavingAddress, setIsSavingAddress] = useState(false)

  useEffect(() => {
    apiFetch<Account>('/account')
      .then((data) => {
        setAccount(data)
        setUsername(data.username ?? '')
        setStreet(data.address?.street ?? '')
        setCity(data.address?.city ?? '')
        setState(data.address?.state ?? '')
        setZip(data.address?.zip ?? '')
        setAddressId(data.address?.id ?? 0)
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

  async function handleAddressSubmit(event: React.FormEvent) {
    event.preventDefault()
    setAddressError('')
    setAddressSuccess(false)
    setIsSavingAddress(true)

    try {
      let addressUrl = '/addresses'
      if (account?.address) addressUrl = `${addressUrl}/${addressId}`
      const updated = await apiFetch<Address>(addressUrl, {
        method: account?.address ? 'PATCH' : 'PUT',
        body: JSON.stringify({ street, city, state, zip }),
      })
      setAccount((current) => (current ? { ...current, address: updated } : current))
      setAddressSuccess(true)
    } catch (err) {
      setAddressError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSavingAddress(false)
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

      <h2>Address</h2>
      <form onSubmit={handleAddressSubmit}>
        <div>
          <label htmlFor="account-street">Street</label>
          <input
            id="account-street"
            type="text"
            autoComplete="street-address"
            required
            value={street}
            onChange={(event) => setStreet(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="account-city">City</label>
          <input
            id="account-city"
            type="text"
            autoComplete="address-level2"
            required
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="account-state">State</label>
          <input
            id="account-state"
            type="text"
            autoComplete="address-level1"
            required
            value={state}
            onChange={(event) => setState(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="account-zip">ZIP code</label>
          <input
            id="account-zip"
            type="text"
            autoComplete="postal-code"
            pattern="\d{5}(-\d{4})?"
            title="5-digit ZIP code, optionally followed by a 4-digit extension"
            required
            value={zip}
            onChange={(event) => setZip(event.target.value)}
          />
        </div>
        {addressError && <p role="alert">{addressError}</p>}
        {addressSuccess && <p>Address updated.</p>}
        <button type="submit" disabled={isSavingAddress}>
          {isSavingAddress ? 'Saving…' : 'Save'}
        </button>
      </form>
    </>
  )
}

export default AccountPage
