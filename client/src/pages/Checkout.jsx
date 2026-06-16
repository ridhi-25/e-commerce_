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
    <div className="glass-panel" style={{ maxWidth: 520, margin: '40px auto' }}>
      <h2 style={{ marginBottom: 20 }}>Checkout</h2>
      {error && (
        <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}
      <form onSubmit={handleCheckout}>
        <div className="form-group" style={{ marginBottom: 25 }}>
          <label className="form-label">Shipping Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="form-input"
            style={{ minHeight: 100, resize: 'vertical' }}
            placeholder="Enter your complete delivery address"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-success"
          style={{ width: '100%', padding: 14 }}
        >
          {loading ? 'Processing Transaction...' : 'Place Order'}
        </button>
      </form>
    </div>
  )
}
