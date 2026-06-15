const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

async function seed() {
  await mongoose.connect(MONGO_URI);
  
  // Clear existing data
  await Product.deleteMany({});
  await User.deleteMany({});

  // Seed products
  const products = [
    { name: 'T-Shirt', description: 'Comfortable cotton t-shirt', price: 19.99, inStock: true },
    { name: 'Sneakers', description: 'Stylish running sneakers', price: 49.99, inStock: true },
    { name: 'Hat', description: 'Cool baseball cap', price: 12.50, inStock: true },
    { name: 'Jeans', description: 'Classic blue jeans', price: 39.99, inStock: true },
    { name: 'Jacket', description: 'Warm winter jacket', price: 79.99, inStock: true }
  ];
  await Product.insertMany(products);
  console.log('Seeded products');

  // Seed users (admin and regular user)
  const admin = new User({
    username: 'admin',
    email: 'admin@ecommerce.com',
    password: 'admin123',
    role: 'admin'
  });
  await admin.save();

  const user = new User({
    username: 'user',
    email: 'user@ecommerce.com',
    password: 'user123',
    role: 'user'
  });
  await user.save();

  console.log('Seeded users: admin (admin123), user (user123)');
  mongoose.disconnect();
}

seed().catch(err => console.error(err));

