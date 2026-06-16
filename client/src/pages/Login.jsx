import React, { useState } from 'react'
import { useAuth } from '../AuthContext'

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      await login(username, password)
      onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="glass-panel" style={{ maxWidth: 420, margin: '80px auto' }}>
      <h2 style={{ marginBottom: 25, textAlign: 'center' }}>Welcome Back</h2>
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
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: 30 }}>
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
      </form>
    </div>
  )
}
