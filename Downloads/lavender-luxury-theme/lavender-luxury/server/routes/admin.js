const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
console.log("protect =", protect);
console.log("adminOnly =", adminOnly);
// const { protect, adminOnly } = require('../middleware/auth');
const { Order, Payment } = require('../models/index');
const Product = require('../models/Product');
const User = require('../models/User');
const { Coupon } = require('../models/index');

// @GET /api/admin/dashboard - Analytics overview
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly sales for last 12 months
    const monthlyData = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' }, orders: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    const categorySales = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productData' } },
      { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },
      { $match: { 'productData.category': { $exists: true, $ne: null } } },
      { $group: {
        _id: '$productData.category',
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 },
        unitsSold: { $sum: '$items.quantity' }
      } },
      { $project: { _id: 0, category: '$_id', revenue: 1, orders: 1, unitsSold: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 8 }
    ]);

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Customer growth
    const customerGrowth = await User.aggregate([
      { $match: { role: 'customer', createdAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } } },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      stats: { totalOrders, pendingOrders, totalCustomers, totalProducts, totalRevenue, lowStockProducts },
      monthlyData,
      categorySales,
      topProducts,
      recentOrders,
      customerGrowth
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
//-----------coupons----------
router.delete(
  '/coupon/:id',
  protect,
  adminOnly,
  async (req, res) => {
    try {

      await Coupon.findByIdAndDelete(
        req.params.id
      );

      res.json({
        success: true
      });

    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
});
router.put(
  '/coupon/:id',
  protect,
  adminOnly,
  async (req, res) => {

    try {

      const coupon =
      await Coupon.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json({
        success: true,
        coupon
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message
      });

    }
});
router.post('/coupon', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.get('/coupons', protect, adminOnly, async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      coupons
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
router.post('/coupon', protect, adminOnly, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      coupon
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});
// @GET /api/admin/customers
router.get('/customers', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'customer' };
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }];
    const customers = await User.find(query).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));
    const total = await User.countDocuments(query);
    res.json({ success: true, customers, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/admin/inventory
router.get('/inventory', protect, adminOnly, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).populate('category', 'name').sort({ stock: 1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
