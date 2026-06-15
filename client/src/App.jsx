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
      <div style={{ padding: 20 }}>
        <h1>E-commerce Store</h1>
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setPage('login')} style={{ marginRight: 10, padding: 8 }}>Login</button>
          <button onClick={() => setPage('register')} style={{ padding: 8 }}>Register</button>
        </div>
        {page === 'login' && <Login onSuccess={() => setPage('home')} />}
        {page === 'register' && <Register onSuccess={() => setPage('home')} />}
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{ backgroundColor: '#333', color: 'white', padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => setPage('home')} style={{ marginRight: 15, padding: 8, backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 }}>Shop</button>
          <button onClick={() => setPage('cart')} style={{ marginRight: 15, padding: 8, backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 }}>Cart</button>
          {user.role === 'admin' && (
            <button onClick={() => setPage('admin')} style={{ marginRight: 15, padding: 8, backgroundColor: 'transparent', color: 'white', border: 'none', cursor: 'pointer', fontSize: 16 }}>Admin</button>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <span>Welcome, {user.username}!</span>
          <button onClick={() => { logout(); setPage('home') }} style={{ padding: 8, backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: 20 }}>
        {successMessage && <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: 15, marginBottom: 20, borderRadius: 4 }}>{successMessage}</div>}

        {page === 'home' && <Home onAddToCart={handleAddToCart} />}
        {page === 'cart' && <Cart onCheckout={() => setPage('checkout')} />}
        {page === 'checkout' && <Checkout onOrderPlaced={handleOrderPlaced} />}
        {page === 'admin' && user.role === 'admin' && <Admin />}
      </div>
    </div>
  )
}

