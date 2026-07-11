// wishlist.js
const express = require('express');
const router = express.Router();
const { Wishlist, Review, Coupon, Category } = require('../models/index');
const StoreSettings = require('../models/StoreSettings');
const LoyaltyCouponSettings = require('../models/LoyaltyCouponSettings');
const Product = require('../models/Product');
// const { protect, adminOnly } = require('../middleware/auth');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { staffOnly } = require('../middleware/staff');
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

  // GET reviews for a product
  r.get('/product/:productId', async (req, res) => {
    try {
      const reviews = await Review.find({ product: req.params.productId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 });
      res.json({ success: true, reviews });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });

  // POST a new review (logged-in users only)
  r.post('/', protect, async (req, res) => {
    try {
      const { product: productId, rating, comment, title } = req.body;

      if (!productId || !rating) {
        return res.status(400).json({ success: false, message: 'Product and rating are required' });
      }
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }

      // Check if user already reviewed this product
      const existing = await Review.findOne({ user: req.user._id, product: productId });
      if (existing) {
        return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
      }

      const review = await Review.create({
        user: req.user._id,
        product: productId,
        rating: Number(rating),
        comment: comment || '',
        title: title || ''
      });

      // Recalculate product ratings
      const allReviews = await Review.find({ product: productId });
      const numReviews = allReviews.length;
      const avgRating = numReviews > 0
        ? parseFloat((allReviews.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(1))
        : 0;

      await Product.findByIdAndUpdate(productId, { ratings: avgRating, numReviews });

      const populated = await review.populate('user', 'name avatar');
      res.status(201).json({ success: true, review: populated, avgRating, numReviews });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });

  return r;
})();

module.exports.couponRouter = (() => {
  const r = express.Router();
  r.post('/validate', async (req, res) => {
    try {
      const { code, orderValue } = req.body;

      // Check if coupons are enabled globally
      const settings = await LoyaltyCouponSettings.findOne({ key: 'global' });
      if (settings && !settings.enabled) {
        return res.status(400).json({ success: false, message: 'Coupons are currently disabled by the administrator' });
      }

      const coupon = await require('mongoose').model('Coupon').findOne({ code: code.toUpperCase(), isActive: true });
      if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });
      if (coupon.expiresAt && new Date() > coupon.expiresAt) return res.status(400).json({ success: false, message: 'Coupon expired' });
      if (orderValue < coupon.minOrderValue) return res.status(400).json({ success: false, message: `Minimum order value ₹${coupon.minOrderValue} required` });
      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
      }
      let discount = coupon.type === 'percentage' ? (orderValue * coupon.value / 100) : coupon.value;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      console.log(`Coupon validated: ${code.toUpperCase()}, current usedCount: ${coupon.usedCount}, usageLimit: ${coupon.usageLimit || 'unlimited'}`);
      res.json({ success: true, coupon, discount: Math.round(discount) });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  // Available coupons — visible to customers during checkout and also used by staff/admin
  r.get('/available', async (req, res) => {
    try {
      // Check if coupons are enabled globally
      const settings = await LoyaltyCouponSettings.findOne({ key: 'global' });
      if (settings && !settings.enabled) {
        return res.json({ success: true, coupons: [] });
      }

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
  r.get('/settings', async (req, res) => {
    try {
      const settings = await StoreSettings.findOneAndUpdate({ key: 'global' }, { $setOnInsert: { key: 'global' } }, { new: true, upsert: true, setDefaultsOnInsert: true });
      res.json({ success: true, settings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  });
  r.get('/', protect, adminOnly, async (req, res) => {
    try {
      const coupons = await require('mongoose').model('Coupon').find();
      res.json({ success: true, coupons });
    } catch (err) { res.status(500).json({ success: false, message: err.message }); }
  });
  r.post('/', protect, staffOnly, async (req, res) => {
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
