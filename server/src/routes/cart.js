const express = require('express');
const router = express.Router();
const { requireLogin } = require('../middleware/auth');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart
router.get('/', requireLogin, async (req, res) => {
  let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
    await cart.save();
  }
  res.json(cart);
});

// POST /api/cart/add
router.post('/add', requireLogin, async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  
  let cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    cart = new Cart({ userId: req.user._id, items: [] });
  }
  
  const existingItem = cart.items.find(i => i.productId.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, quantity, price: product.price });
  }
  
  cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  await cart.save();
  res.json(cart);
});

// DELETE /api/cart/remove/:productId
router.delete('/remove/:productId', requireLogin, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
  cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
  cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  await cart.save();
  res.json(cart);
});

// POST /api/cart/clear
router.post('/clear', requireLogin, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (cart) {
    cart.items = [];
    cart.total = 0;
    await cart.save();
  }
  res.json(cart);
});

module.exports = router;
