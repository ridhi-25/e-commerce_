import React, { useEffect, useState } from 'react'

export default function Admin() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [tab, setTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '' })
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
        setNewProduct({ name: '', description: '', price: '' })
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
    <div>
      <h1>Admin Panel</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('orders')} style={{ marginRight: 10, padding: 10, backgroundColor: tab === 'orders' ? '#007bff' : '#ddd', color: tab === 'orders' ? 'white' : 'black' }}>Orders</button>
        <button onClick={() => setTab('products')} style={{ padding: 10, backgroundColor: tab === 'products' ? '#007bff' : '#ddd', color: tab === 'products' ? 'white' : 'black' }}>Products</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {tab === 'orders' && (
        <div>
          <h2>Orders</h2>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd' }}>
                  <th style={{ textAlign: 'left', padding: 10 }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Total</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Status</th>
                  <th style={{ textAlign: 'left', padding: 10 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 10 }}>{order._id.slice(-6)}</td>
                    <td style={{ padding: 10 }}>{order.userId.username}</td>
                    <td style={{ padding: 10 }}>${order.total.toFixed(2)}</td>
                    <td style={{ padding: 10 }}>{order.status}</td>
                    <td style={{ padding: 10 }}>
                      <select onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)} value={order.status}>
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <h2>Products</h2>
          <div style={{ marginBottom: 30, padding: 20, border: '1px solid #ddd', borderRadius: 8 }}>
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct}>
              <div style={{ marginBottom: 10 }}>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: 8, minHeight: 80 }}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  style={{ width: '100%', padding: 8 }}
                />
              </div>
              <button type="submit" style={{ padding: 10, backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Add Product</button>
            </form>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ textAlign: 'left', padding: 10 }}>Name</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Price</th>
                <th style={{ textAlign: 'left', padding: 10 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(prod => (
                <tr key={prod._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: 10 }}>{prod.name}</td>
                  <td style={{ padding: 10 }}>${prod.price}</td>
                  <td style={{ padding: 10 }}>
                    <button onClick={() => handleDeleteProduct(prod._id)} style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

