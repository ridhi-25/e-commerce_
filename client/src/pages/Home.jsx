import React, { useEffect, useState } from 'react'

export default function Home({ onAddToCart }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://localhost:4000/api/products', { credentials: 'include' })
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h1>Shop</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        {products.map(p => (
          <div key={p._id} style={{ border: '1px solid #ddd', padding: 15, borderRadius: 8 }}>
            <h3>{p.name}</h3>
            <p>{p.description}</p>
            <p style={{ fontSize: 18, fontWeight: 'bold' }}>${p.price}</p>
            <button
              onClick={() => onAddToCart(p._id, 1)}
              style={{ width: '100%', padding: 10, backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

