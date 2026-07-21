const express = require('express');
const router = express.Router();
const { Cart } = require('../models/index');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

const getPopulatedCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return { items: [] };
  
  const rawProductIds = cart.items.map(item => item.product);
  const populated = await cart.populate('items.product');
  const cartObj = populated.toObject();
  
  cartObj.items.forEach((item, idx) => {
    if (!item.product && rawProductIds[idx]) {
      item.product = rawProductIds[idx].toString();
    }
  });
  
  return cartObj;
};

router.get('/', protect, async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/add', protect, async (req, res) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    
    // Check product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Determine available stock based on variant or total product stock
    let availableStock = product.stock || 0;
    let variantInfo = '';
    
    if (size && Array.isArray(product.variants) && product.variants.length > 0) {
      // Find matching variant by size and color
      const variant = product.variants.find(v => 
        v.size === size && 
        (!color || !v.color?.name || v.color.name.toLowerCase() === color.toLowerCase())
      );
      
      if (variant) {
        availableStock = variant.stock || 0;
        variantInfo = variant.color?.name ? `${variant.color.name} - ${variant.size}` : variant.size;
      }
    }
    
    // Ensure stock is never negative
    availableStock = Math.max(0, availableStock);
    
    if (availableStock <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: variantInfo ? `No more stock available for ${variantInfo}` : 'No more product left' 
      });
    }
    
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    
    // Find existing item by productId + size + color
    const existingIdx = cart.items.findIndex(i => 
      i.product && i.product.toString() === productId && 
      i.size === size && 
      i.color === color
    );
    const currentQuantity = existingIdx > -1 ? cart.items[existingIdx].quantity : 0;
    const newQuantity = currentQuantity + quantity;
    
    if (newQuantity > availableStock) {
      return res.status(400).json({ 
        success: false, 
        message: variantInfo 
          ? `Only ${availableStock} item(s) available for ${variantInfo}` 
          : `Only ${availableStock} item(s) available in stock`,
        availableStock
      });
    }
    
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity, size, color });
    }
    await cart.save();
    
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/update/:itemId', protect, async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    
    // Check product stock based on variant
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Determine available stock based on variant or total product stock
    let availableStock = product.stock || 0;
    let variantInfo = '';
    
    if (item.size && Array.isArray(product.variants) && product.variants.length > 0) {
      // Find matching variant by size and color
      const variant = product.variants.find(v => 
        v.size === item.size && 
        (!item.color || !v.color?.name || v.color.name.toLowerCase() === item.color.toLowerCase())
      );
      
      if (variant) {
        availableStock = variant.stock || 0;
        variantInfo = variant.color?.name ? `${variant.color.name} - ${variant.size}` : variant.size;
      }
    }
    
    // Ensure stock is never negative
    availableStock = Math.max(0, availableStock);
    
    if (quantity > availableStock) {
      return res.status(400).json({ 
        success: false, 
        message: variantInfo 
          ? `Only ${availableStock} item(s) available for ${variantInfo}` 
          : `Only ${availableStock} item(s) available in stock`,
        availableStock
      });
    }
    
    if (quantity <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/remove/:itemId', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items.pull(req.params.itemId);
    await cart.save();
    
    const populated = await getPopulatedCart(req.user._id);
    res.json({ success: true, cart: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/clear', protect, async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
