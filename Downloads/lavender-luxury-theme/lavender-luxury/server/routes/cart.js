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
    const normSize = size ? String(size).trim() : '';
    const normColor = color ? String(color).trim() : '';
    
    // Check product exists and is active
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    if (product.isActive === false) {
      return res.status(400).json({ success: false, message: 'This product is not available' });
    }

    // If product has explicit variants, require matching size/color variant
    const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
    const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;
    const hasColors = Array.isArray(product.colors) && product.colors.length > 0;

    if (hasVariants && !normSize) {
      // For products modeled with variants, we require a size (or variant identifier)
      return res.status(400).json({ success: false, message: 'Please select a valid size for this product' });
    }

    if (normSize && hasSizes) {
      // If the product declares a sizes list, ensure the requested size exists
      const sizeExists = product.sizes.some(s => String(s.size).trim() === normSize);
      if (!sizeExists && !hasVariants) {
        return res.status(400).json({ success: false, message: 'Selected size is not available for this product' });
      }
    }

    if (normColor && hasColors) {
      // If product declares colors list, ensure the requested color exists
      const colorExists = product.colors.some(c => String(c.name).trim().toLowerCase() === normColor.toLowerCase());
      if (!colorExists && !hasVariants) {
        return res.status(400).json({ success: false, message: 'Selected color is not available for this product' });
      }
    }
    
    // Determine available stock based on variant or total product stock
    let availableStock = product.stock || 0;
    let variantInfo = '';
    
    if (normSize && Array.isArray(product.variants) && product.variants.length > 0) {
      // Find matching variant by size and color (case-insensitive)
      const variant = product.variants.find(v => 
        String(v.size).trim() === normSize && 
        (!normColor || !v.color?.name || String(v.color.name).trim().toLowerCase() === normColor.toLowerCase())
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
      String(i.size || '').trim() === normSize && 
      String(i.color || '').trim().toLowerCase() === normColor.toLowerCase()
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
      cart.items.push({ product: productId, quantity, size: normSize || undefined, color: normColor || undefined });
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
