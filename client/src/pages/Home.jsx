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
      {/* Hero Banner Section */}
      <div className="glass-panel" style={{ 
        position: 'relative', 
        overflow: 'hidden', 
        padding: '60px 40px', 
        marginBottom: 40, 
        borderRadius: 20, 
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center' 
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>
          Elevate Your Everyday Essentials
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 16, maxWidth: 650, margin: '0 auto 25px', lineHeight: 1.6 }}>
          Discover the handcrafted collection of premium apparel, engineered sneakers, and heritage accessories designed for the modern avant-garde.
        </p>
        <div style={{ display: 'inline-flex', padding: '6px 18px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: 50, border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: 13, color: '#a5b4fc', fontWeight: 600 }}>
          ✨ Free shipping on all orders over $150
        </div>
      </div>

      <h1 style={{ marginBottom: 30, fontSize: 28 }}>Shop Catalog</h1>
      <div className="product-grid">
        {products.map(p => (
          <div key={p._id} className="product-card">
            {p.image && (
              <div style={{ width: '100%', height: 220, borderRadius: 10, overflow: 'hidden', marginBottom: 18, background: 'rgba(0, 0, 0, 0.2)', border: '1px solid var(--border-color)' }}>
                <img 
                  src={p.image} 
                  alt={p.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                />
              </div>
            )}
            <h3 className="product-title" style={{ fontSize: 17, marginBottom: 6 }}>{p.name}</h3>
            <p className="product-desc" style={{ fontSize: 13.5, marginBottom: 18, color: 'var(--text-secondary)' }}>{p.description}</p>
            <div className="product-footer">
              <span className="product-price" style={{ fontSize: 19, fontWeight: 800 }}>${p.price.toFixed(2)}</span>
              <button
                onClick={() => onAddToCart(p._id, 1)}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: 12.5, borderRadius: 8 }}
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

