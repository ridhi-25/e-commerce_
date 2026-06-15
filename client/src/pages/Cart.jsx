import React, { useEffect, useState } from 'react'

export default function Cart({ onCheckout }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCart = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/api/cart', { credentials: 'include' })
      if (res.ok) setCart(await res.json())
      else setError('Failed to load cart')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCart()
  }, [])

  const handleRemove = async (productId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) {
        const updated = await res.json()
        setCart(updated)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleClear = async () => {
    try {
      await fetch('http://localhost:4000/api/cart/clear', { method: 'POST', credentials: 'include' })
      setCart({ items: [], total: 0 })
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div>Loading cart...</div>

  if (!cart || !cart.items) return <div>No cart found</div>

  return (
    <div>
      <h1>Your Cart</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Product</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Price</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Quantity</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map(item => (
                <tr key={item.productId._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{item.productId.name}</td>
                  <td style={{ padding: 10 }}>${item.price.toFixed(2)}</td>
                  <td style={{ padding: 10 }}>{item.quantity}</td>
                  <td style={{ padding: 10 }}>
                    <button onClick={() => handleRemove(item.productId._id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 20 }}>
            <h3>Total: ${cart.total ? cart.total.toFixed(2) : '0.00'}</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleClear} style={{ padding: 10 }}>Clear Cart</button>
              <button onClick={() => onCheckout()} style={{ padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none' }}>Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
