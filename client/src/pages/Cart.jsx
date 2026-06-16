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
    <div className="glass-panel" style={{ maxWidth: 800, margin: '20px auto' }}>
      <h1 style={{ marginBottom: 25 }}>Your Shopping Cart</h1>
      {error && (
        <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 14 }}>
          {error}
        </div>
      )}

      {cart.items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Your cart is empty. Go add some products!</p>
      ) : (
        <div>
          <div className="table-container" style={{ marginBottom: 30 }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map(item => (
                  <tr key={item.productId._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        {item.productId.image && (
                          <img 
                            src={item.productId.image} 
                            alt={item.productId.name} 
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border-color)' }}
                          />
                        )}
                        <span style={{ fontWeight: 600 }}>{item.productId.name}</span>
                      </div>
                    </td>
                    <td>${item.price.toFixed(2)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.quantity}</td>
                    <td>
                      <button onClick={() => handleRemove(item.productId._id)} className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14, textTransform: 'uppercase', letterSpacing: 0.5 }}>Estimated Total</span>
              <h3 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', marginTop: 5 }}>
                ${cart.total ? cart.total.toFixed(2) : '0.00'}
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 15 }}>
              <button onClick={handleClear} className="btn btn-secondary">Clear Cart</button>
              <button onClick={() => onCheckout()} className="btn btn-success">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
