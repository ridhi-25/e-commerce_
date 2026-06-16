import React, { useEffect, useState } from 'react'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    if (tab === 'orders') {
      fetch('http://localhost:4000/api/orders/all', { credentials: 'include' })
        .then(r => r.json())
        .then(setOrders)
    } else {
      fetch('http://localhost:4000/api/products', { credentials: 'include' })
        .then(r => r.json())
        .then(setProducts)
    }
  }, [tab])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    if (!newProduct.name || !newProduct.price) {
      setError('Name and price required')
      return
    }

    try {
      const res = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) })
      })
      if (res.ok) {
        setNewProduct({ name: '', description: '', price: '', image: '' })
        setError('')
        const data = await res.json()
        setProducts([...products, data])
      } else {
        const err = await res.json()
        setError(err.message)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:4000/api/products/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      setProducts(products.filter(p => p._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="glass-panel" style={{ maxWidth: 1000, margin: '20px auto' }}>
      <h1 style={{ marginBottom: 25 }}>Administrator Dashboard</h1>
      <div style={{ display: 'flex', gap: 15, marginBottom: 30 }}>
        <button 
          onClick={() => setTab('orders')} 
          className={`btn ${tab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 20px', borderRadius: 8 }}
        >
          Manage Orders
        </button>
        <button 
          onClick={() => setTab('products')} 
          className={`btn ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '10px 20px', borderRadius: 8 }}
        >
          Manage Products
        </button>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.1)', color: 'var(--danger-color)', padding: 12, borderRadius: 8, marginBottom: 25, fontSize: 14 }}>
          {error}
        </div>
      )}

      {tab === 'orders' && (
        <div>
          <h2 style={{ fontSize: 20, marginBottom: 15, color: 'var(--text-secondary)' }}>Customer Orders</h2>
          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No orders have been placed yet.</p>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: '#a5b4fc' }}>#{order._id.slice(-6).toUpperCase()}</td>
                      <td>{order.userId?.username || 'Unknown'}</td>
                      <td style={{ fontWeight: 600 }}>₹{order.total.toFixed(2)}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: 6, 
                          fontSize: 12, 
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          backgroundColor: order.status === 'delivered' ? 'rgba(16, 185, 129, 0.15)' : order.status === 'shipped' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color: order.status === 'delivered' ? 'var(--success-color)' : order.status === 'shipped' ? 'var(--primary-color)' : '#f59e0b'
                        }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <select 
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} 
                          value={order.status}
                          style={{
                            background: 'rgba(15, 23, 42, 0.8)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            padding: '6px 10px',
                            borderRadius: 6,
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div style={{ marginBottom: 35, padding: 25, background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border-color)', borderRadius: 12 }}>
            <h3 style={{ marginBottom: 20 }}>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div className="form-group">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter product title"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  placeholder="Enter details description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="form-input"
                  style={{ minHeight: 80, resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group" style={{ marginBottom: 25 }}>
                <label className="form-label">Image URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  className="form-input"
                />
              </div>
              <button type="submit" className="btn btn-success">Publish Product</button>
            </form>
          </div>

          <h3 style={{ marginBottom: 15 }}>Product List</h3>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                        {prod.image && (
                          <img 
                            src={prod.image} 
                            alt={prod.name} 
                            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-color)' }}
                          />
                        )}
                        <span style={{ fontWeight: 600 }}>{prod.name}</span>
                      </div>
                    </td>
                    <td>₹{prod.price.toFixed(2)}</td>
                    <td>
                      <button 
                        onClick={() => handleDeleteProduct(prod._id)} 
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: 12, borderRadius: 6 }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

