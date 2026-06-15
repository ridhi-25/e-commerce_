import React, { useEffect, useState } from 'react'

const AuthContext = React.createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/api/auth/me', { credentials: 'include' })
      .then(r => r.json())
      .then(data => setUser(data.user))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const login = async (username, password) => {
    const res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (res.ok) {
      setUser(data.user)
      return true
    }
    throw new Error(data.message)
  }

  const register = async (username, email, password) => {
    const res = await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    const data = await res.json()
    if (res.ok) {
      setUser(data.user)
      return true
    }
    throw new Error(data.message)
  }

  const logout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => React.useContext(AuthContext)
