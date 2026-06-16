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
    { 
      name: 'Minimalist Cotton Tee', 
      description: 'Ultra-soft organic cotton tee crafted for comfort, styled with a modern tailored silhouette.', 
      price: 29.99, 
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      inStock: true 
    },
    { 
      name: 'Vanguard Running Sneakers', 
      description: 'Responsive cushioning and aerodynamic grip designed for peak performance and sleek athletic style.', 
      price: 119.99, 
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      inStock: true 
    },
    { 
      name: 'Heritage Wool Cap', 
      description: 'Structured profile made of refined wool blend with adjustable leather clasp strap.', 
      price: 34.50, 
      image: 'https://images.unsplash.com/photo-1534215754734-18e55d13ce35?w=600&auto=format&fit=crop&q=80',
      inStock: true 
    },
    { 
      name: 'Raw Selvedge Denim Jeans', 
      description: 'Premium raw indigo selvedge jeans designed to mold uniquely to your shape over time.', 
      price: 89.99, 
      image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&auto=format&fit=crop&q=80',
      inStock: true 
    },
    { 
      name: 'Classic Biker Leather Jacket', 
      description: 'Full-grain lambskin leather jacket featuring metal hardware zippers and a tailored quilted lining.', 
      price: 249.99, 
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      inStock: true 
    }
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

