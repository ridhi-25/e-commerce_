const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      productName: String,
      quantity: Number,
      price: Number
    }
  ],
  total: Number,
  status: { type: String, enum: ['pending', 'shipped', 'delivered'], default: 'pending' },
  shippingAddress: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
