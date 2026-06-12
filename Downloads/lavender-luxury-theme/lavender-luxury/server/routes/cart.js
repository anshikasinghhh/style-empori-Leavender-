const express = require('express');
const router = express.Router();
const { Cart } = require('../models/index');
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
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });
    
    const existingIdx = cart.items.findIndex(i => i.product && i.product.toString() === productId && i.size === size);
    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
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
