import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function Register({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await register(username, email, password)
      onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="glass-panel" style={{ maxWidth: 420, margin: '60px auto' }}>
      <h2 style={{ marginBottom: 25, textAlign: 'center' }}>Create Account</h2>
      {error && (
        <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', padding: 12, borderRadius: 8, marginBottom: 20, fontSize: 14, border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 30 }}>
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
    </div>
  )
}
