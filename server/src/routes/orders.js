const express = require('express');
const router = express.Router();
const { requireLogin, requireAdmin } = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// GET /api/orders (user's orders)
router.get('/', requireLogin, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id }).populate('items.productId');
  res.json(orders);
});

// GET /api/orders/all (admin - all orders)
router.get('/all', requireAdmin, async (req, res) => {
  const orders = await Order.find().populate('userId', 'username email').populate('items.productId');
  res.json(orders);
});

// POST /api/orders/checkout
router.post('/checkout', requireLogin, async (req, res) => {
  const { shippingAddress } = req.body;
  if (!shippingAddress) return res.status(400).json({ message: 'Shipping address required' });
  
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }
  
  const order = new Order({
    userId: req.user._id,
    items: cart.items,
    total: cart.total,
    shippingAddress,
    status: 'pending'
  });
  
  await order.save();
  await Cart.updateOne({ userId: req.user._id }, { items: [], total: 0 });
  res.status(201).json(order);
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

module.exports = router;
