import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Login from './pages/Login'
import Register from './pages/Register'

export default function App() {
  const { user, loading, logout } = useAuth()
  const [page, setPage] = useState('home')
  const [successMessage, setSuccessMessage] = useState('')

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>

  const handleAddToCart = async (productId, quantity) => {
    try {
      const res = await fetch('http://localhost:4000/api/cart/add', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      })
      if (res.ok) {
        setSuccessMessage('Added to cart!')
        setTimeout(() => setSuccessMessage(''), 2000)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleOrderPlaced = () => {
    setSuccessMessage('Order placed successfully!')
    setPage('home')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (!user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 20 }}>
        <div className="glass-panel" style={{ maxWidth: 450, width: '100%', textAlign: 'center' }}>
          <h1 style={{ marginBottom: 15, background: 'linear-gradient(135deg, #a5b4fc 0%, #6366f1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AuraShop</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 30, fontSize: 16 }}>Your premium destination for style and comfort.</p>
          <div style={{ display: 'flex', gap: 15, justifyContent: 'center', marginBottom: 20 }}>
            <button className={`btn ${page === 'login' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage('login')} style={{ flex: 1 }}>Sign In</button>
            <button className={`btn ${page === 'register' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPage('register')} style={{ flex: 1 }}>Sign Up</button>
          </div>
          {page === 'login' && <Login onSuccess={() => setPage('home')} />}
          {page === 'register' && <Register onSuccess={() => setPage('home')} />}
          {page !== 'login' && page !== 'register' && <Login onSuccess={() => setPage('home')} />}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 60 }}>
      <nav className="navbar">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setPage('home')}>AuraShop</div>
        <div className="nav-links">
          <button onClick={() => setPage('home')} className={`nav-btn ${page === 'home' ? 'active' : ''}`}>Shop</button>
          <button onClick={() => setPage('cart')} className={`nav-btn ${page === 'cart' ? 'active' : ''}`}>Cart</button>
          {user.role === 'admin' && (
            <button onClick={() => setPage('admin')} className={`nav-btn ${page === 'admin' ? 'active' : ''}`} style={{ border: '1px solid rgba(99, 102, 241, 0.4)' }}>Admin Panel</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Welcome, <strong style={{ color: 'var(--text-primary)' }}>{user.username}</strong>
          </span>
          <button onClick={() => { logout(); setPage('home') }} className="btn btn-danger" style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWdth: 1200, margin: '40px auto', padding: '0 20px' }}>
        {successMessage && <div className="alert-success">{successMessage}</div>}

        {page === 'home' && <Home onAddToCart={handleAddToCart} />}
        {page === 'cart' && <Cart onCheckout={() => setPage('checkout')} />}
        {page === 'checkout' && <Checkout onOrderPlaced={handleOrderPlaced} />}
        {page === 'admin' && user.role === 'admin' && <Admin />}
      </div>
    </div>
  )
}

