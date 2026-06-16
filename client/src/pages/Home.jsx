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
      <h1 style={{ marginBottom: 30 }}>Shop Catalog</h1>
      <div className="product-grid">
        {products.map(p => (
          <div key={p._id} className="product-card">
            <h3 className="product-title">{p.name}</h3>
            <p className="product-desc">{p.description}</p>
            <div className="product-footer">
              <span className="product-price">${p.price.toFixed(2)}</span>
              <button
                onClick={() => onAddToCart(p._id, 1)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: 13, borderRadius: 8 }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

