// wishlist.js
const express = require('express');
const router = express.Router();
const { Wishlist, Review, Coupon, Category } = require('../models/index');
// const { protect, adminOnly } = require('../middleware/auth');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
module.exports.wishlistRouter = (() => {
  const r = express.Router();
  r.get('/', protect, async (req, res) => {
    try {
      const wishlist = await Wishlist.findOne({ user: req.user._id });
      if (!wishlist) return res.json({ success: true, wishlist: { products: [] } });
      
      const rawProductIds = [...wishlist.products];
      const populated = await wishlist.populate('products');
      const wishlistObj = populated.toObject();
      
      wishlistObj.products = wishlistObj.products.map((p, idx) => {
        if (!p && rawProductIds[idx]) {
          return rawProductIds[idx].toString();
        }
        return p;
      });
      
      res.json({ success: true, wishlist: wishlistObj });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.post('/toggle/:productId', protect, async (req, res) => {
    try {
      let wishlist = await Wishlist.findOne({ user: req.user._id });
      if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
      
      const idx = wishlist.products.findIndex(id => id.toString() === req.params.productId);
      if (idx > -1) {
        wishlist.products.splice(idx, 1);
      } else {
        wishlist.products.push(req.params.productId);
      }
      await wishlist.save();
      const populated = await wishlist.populate('products');
      res.json({ success: true, wishlist: populated, isWishlisted: idx === -1 });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  return r;
})();

module.exports.reviewRouter = (() => {
  const r = express.Router();
  r.get('/product/:productId', async (req, res) => {
    try {
      const reviews = await Review.findOne ? 
        await require('mongoose').model('Review').find({ product: req.params.productId }).populate('user', 'name avatar') : [];
      res.json({ success: true, reviews });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.post('/', protect, async (req, res) => {
    try {
      const review = await require('mongoose').model('Review').create({ ...req.body, user: req.user._id });
      res.status(201).json({ success: true, review });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  return r;
})();

module.exports.couponRouter = (() => {
  const r = express.Router();
  r.post('/validate', protect, async (req, res) => {
    try {
      const { code, orderValue } = req.body;
      const coupon = await require('mongoose').model('Coupon').findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
      if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: 'Coupon expired' });
      if (orderValue < coupon.minOrderValue) return res.status(400).json({ success: false, message: `Minimum order value ₹${coupon.minOrderValue} required` });
      let discount = coupon.type === 'percentage' ? (orderValue * coupon.value / 100) : coupon.value;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      res.json({ success: true, coupon, discount: Math.round(discount) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  // Available coupons — accessible by both admin and employee (no adminOnly guard)
  r.get('/available', protect, async (req, res) => {
    try {
      const now = new Date();
      const coupons = await require('mongoose').model('Coupon').find({
        isActive: true,
        $or: [
          { expiresAt: { $exists: false } },
          { expiresAt: null },
          { expiresAt: { $gt: now } }
        ]
      }).select('code type value minOrderValue maxDiscount expiresAt').sort({ createdAt: -1 });
      res.json({ success: true, coupons });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.get('/', protect, adminOnly, async (req, res) => {
    try {
      const coupons = await require('mongoose').model('Coupon').find();
      res.json({ success: true, coupons });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.post('/', protect, adminOnly, async (req, res) => {
    try {
      const coupon = await require('mongoose').model('Coupon').create(req.body);
      res.status(201).json({ success: true, coupon });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  return r;
})();

module.exports.categoryRouter = (() => {
  const r = express.Router();
  r.get('/', async (req, res) => {
    try {
      const categories = await require('mongoose').model('Category').find({ isActive: true }).sort('sortOrder');
      res.json({ success: true, categories });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.post('/', protect, adminOnly, async (req, res) => {
    try {
      const cat = await require('mongoose').model('Category').create(req.body);
      res.status(201).json({ success: true, category: cat });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.put('/:id', protect, adminOnly, async (req, res) => {
    try {
      const cat = await require('mongoose').model('Category').findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ success: true, category: cat });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
      await require('mongoose').model('Category').findByIdAndUpdate(req.params.id, { isActive: false });
      res.json({ success: true, message: 'Category deleted' });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  return r;
})();
