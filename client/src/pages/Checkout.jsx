import React, { useState } from 'react'

export default function Checkout({ onOrderPlaced }) {
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async (e) => {
    e.preventDefault()
    if (!address.trim()) {
      setError('Please enter shipping address')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/orders/checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress: address })
      })
      const data = await res.json()
      if (res.ok) {
        onOrderPlaced()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', padding: 20, border: '1px solid #ccc' }}>
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCheckout}>
        <div style={{ marginBottom: 15 }}>
          <label>Shipping Address:</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: '100%', padding: 10, marginTop: 5, minHeight: 100 }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
