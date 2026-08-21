const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/vastra-elegance';

mongoose.connect(uri)
.then(async () => {
  const Product = require('./models/Product');
  const count = await Product.countDocuments();
  console.log('Product count in DB:', count);
  if (count > 0) {
    const products = await Product.find().limit(5);
    console.log('Sample Products in DB:');
    products.forEach(p => console.log(`ID: ${p._id}, Name: ${p.name}`));
  }
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
