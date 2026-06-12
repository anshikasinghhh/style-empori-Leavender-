const express = require('express');
const router = express.Router();
const { Order, Cart, Wishlist } = require('../models/index');
const Product = require('../models/Product');
// const { protect, adminOnly } = require('../middleware/auth');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
// ===== ORDER ROUTES =====
// @POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, couponDiscount } = req.body;
    let subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal - (couponDiscount || 0) + shippingCost + tax;

    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentMethod,
      couponCode, couponDiscount: couponDiscount || 0,
      subtotal, shippingCost, tax, total,
      statusHistory: [{ status: 'placed', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update product stock
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity, sold: item.quantity }
        });
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders/my-orders
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product').populate('user', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/orders - Admin: all orders
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/orders/:id/status - Admin
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    order.orderStatus = status;
    order.statusHistory.push({ status, timestamp: new Date(), note });
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
