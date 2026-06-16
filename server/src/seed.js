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
      price: 999.00, 
      image: '/images/white_tee.png',
      inStock: true 
    },
    { 
      name: 'Vanguard Running Sneakers', 
      description: 'Responsive cushioning and aerodynamic grip designed for peak performance and sleek athletic style.', 
      price: 4999.00, 
      image: '/images/sneakers.png',
      inStock: true 
    },
    { 
      name: 'Heritage Wool Cap', 
      description: 'Structured profile made of refined wool blend with adjustable leather clasp strap.', 
      price: 799.00, 
      image: '/images/wool_cap.png',
      inStock: true 
    },
    { 
      name: 'Raw Selvedge Denim Jeans', 
      description: 'Premium raw indigo selvedge jeans designed to mold uniquely to your shape over time.', 
      price: 2499.00, 
      image: '/images/denim_jeans.png',
      inStock: true 
    },
    { 
      name: 'Classic Biker Leather Jacket', 
      description: 'Full-grain lambskin leather jacket featuring metal hardware zippers and a tailored quilted lining.', 
      price: 9999.00, 
      image: '/images/leather_jacket.png',
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

