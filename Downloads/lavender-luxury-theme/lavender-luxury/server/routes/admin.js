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
const StoreSettings = require('../models/StoreSettings');

// @GET /api/admin/dashboard - Analytics overview
router.get('/dashboard', protect, adminOnly, async (req, res) => {
  try {
    // Use all time data instead of date-restricted
    const totalOrders = await Order.countDocuments({});
    const pendingOrders = await Order.countDocuments({ orderStatus: 'placed' });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

    const revenueMatch = {
      orderStatus: { $nin: ['cancelled'] },
      paymentStatus: { $nin: ['failed', 'refunded'] }
    };

    const revenueAgg = await Order.aggregate([
      { $match: revenueMatch },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Monthly sales for all time
    const monthlyData = await Order.aggregate([
      { $match: revenueMatch },
      { $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$total' }, orders: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $match: revenueMatch },
      { $unwind: '$items' },
      { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalSold: { $sum: '$items.quantity' }, revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    const categorySales = await Order.aggregate([
      { $match: revenueMatch },
      { $unwind: '$items' },
      { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'productData' } },
      { $unwind: { path: '$productData', preserveNullAndEmptyArrays: true } },
      { $group: {
        _id: { $ifNull: ['$productData.category', 'Uncategorized'] },
        revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        orders: { $sum: 1 },
        unitsSold: { $sum: '$items.quantity' }
      } },
      { $project: { _id: 0, category: '$_id', revenue: { $round: ['$revenue', 2] }, orders: 1, unitsSold: 1 } },
      { $sort: { revenue: -1 } },
      { $limit: 8 }
    ]);

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    // Customer growth for all time
    const customerGrowth = await User.aggregate([
      { $match: { role: 'customer' } },
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

// @GET /api/admin/sidebar-stats - Dynamic sidebar counts
router.get('/sidebar-stats', protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalOrders = await Order.countDocuments({});
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 }, isActive: true });

    res.json({
      success: true,
      stats: {
        products: totalProducts,
        orders: totalOrders,
        customers: totalCustomers,
        inventory: lowStockProducts
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
//-----------coupons----------
// Middleware: admin OR employee with canManageCoupons
const couponAccess = (req, res, next) => {
  if (req.user.role === 'admin') return next();
  if (req.user.role === 'employee' && req.user.canManageCoupons) return next();
  return res.status(403).json({ success: false, message: 'Not authorized to manage coupons' });
};
router.delete(
  '/coupon/:id',
  protect,
  couponAccess,
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
  couponAccess,
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
router.post('/coupon', protect, couponAccess, async (req, res) => {
  try {
    // Ensure usedCount is initialized to 0 if not provided
    const couponData = { ...req.body, usedCount: req.body.usedCount || 0 };
    const coupon = await Coupon.create(couponData);

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
router.get('/coupons', protect, couponAccess, async (req, res) => {
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
router.post('/coupon', protect, couponAccess, async (req, res) => {
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
router.get('/settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await StoreSettings.findOneAndUpdate({ key: 'global' }, { $setOnInsert: { key: 'global' } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const { handlingCharge } = req.body;
    const settings = await StoreSettings.findOneAndUpdate(
      { key: 'global' },
      { $set: { handlingCharge: Number(handlingCharge || 0), updatedBy: req.user._id } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

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

// @DELETE /api/admin/customers/:id
router.delete('/customers/:id', protect, adminOnly, async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Customer deleted' });
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

// @POST /api/admin/recalculate-stock - Recalculate stock for all products with variants
router.post('/recalculate-stock', protect, adminOnly, async (req, res) => {
  try {
    const updated = await Product.recalculateAllStock();
    res.json({ success: true, message: `Recalculated stock for ${updated} products`, updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
