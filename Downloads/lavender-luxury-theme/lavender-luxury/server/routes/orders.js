const express = require('express');
const router = express.Router();
const { Order, Cart, Wishlist, Coupon } = require('../models/index');
const Product = require('../models/Product');
const StoreSettings = require('../models/StoreSettings');
const LoyaltyCouponSettings = require('../models/LoyaltyCouponSettings');
const { createShiprocketOrder } = require('../services/shiprocketService');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const { notifyAdmins, notifyEmployees, createNotification } = require('../services/notificationService');
// ===== ORDER ROUTES =====
// @POST /api/orders
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode, couponDiscount, giftWrap, donationAmount } = req.body;
    
    console.log('Order creation - couponCode received:', couponCode);
    
    let subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = subtotal > 999 ? 0 : 99;
    const settings = await StoreSettings.findOne({ key: 'global' });
    const handlingCharge = Number(settings?.handlingCharge || 0);
    const tax = Math.round(subtotal * 0.05);
    const giftWrapCost = giftWrap ? 50 : 0;
    const donation = Math.max(0, Number(donationAmount) || 0);
    const total = subtotal - (couponDiscount || 0) + shippingCost + handlingCharge + tax + giftWrapCost + donation;

    const order = await Order.create({
      user: req.user._id, items, shippingAddress, paymentMethod,
      couponCode, couponDiscount: couponDiscount || 0,
      subtotal, shippingCost, handlingCharge, tax, giftWrap: !!giftWrap, giftWrapCost, donationAmount: donation, total,
      statusHistory: [{ status: 'placed', timestamp: new Date() }],
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Update product stock and check for low stock
    const io = req.app.get('io');
    const lowStockProducts = [];

    for (const item of items) {
      if (!item.product) continue;
      const product = await Product.findById(item.product);
      if (!product) continue;

      const normSize = item.size ? String(item.size).trim() : '';
      const normColor = item.color ? String(item.color).trim().toLowerCase() : '';

      // If product has variants and item refers to a variant, decrement that variant's stock
      if (Array.isArray(product.variants) && product.variants.length > 0 && normSize) {
        const idx = product.variants.findIndex(v => String(v.size).trim() === normSize && (!normColor || !v.color?.name || String(v.color.name).trim().toLowerCase() === normColor));
        if (idx > -1) {
          product.variants[idx].stock = Math.max(0, (Number(product.variants[idx].stock) || 0) - Number(item.quantity || 0));
          product.sold = (Number(product.sold) || 0) + Number(item.quantity || 0);
          // Recalculate aggregate stock
          product.stock = product.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
          await product.save();

          // Variant-level low stock notification
          const vstock = product.variants[idx].stock;
          if (vstock <= 5 && vstock > 0) lowStockProducts.push({ name: `${product.name} (${product.variants[idx].size}${product.variants[idx].color?.name ? ' - ' + product.variants[idx].color.name : ''})`, stock: vstock });
          if (vstock <= 0) lowStockProducts.push({ name: `${product.name} (${product.variants[idx].size}${product.variants[idx].color?.name ? ' - ' + product.variants[idx].color.name : ''})`, stock: 0 });
          continue;
        }
      }

      // Fallback: decrement root stock when no matching variant
      const updated = await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity, sold: item.quantity } },
        { new: true }
      );
      if (updated && updated.stock <= 5 && updated.stock > 0) {
        lowStockProducts.push({ name: updated.name, stock: updated.stock });
      }
      if (updated && updated.stock <= 0) {
        lowStockProducts.push({ name: updated.name, stock: 0 });
      }
    }

    // Notify admins about new order
    const customerName = req.user.name || 'A customer';
    await notifyAdmins(io, {
      type: 'order_placed',
      title: 'New Order Received',
      message: `${customerName} placed a new order (#${order.orderNumber}) totaling ₹${order.total}`,
      link: '/admin/orders',
      relatedId: order._id
    });

    // Notify admins and employees about low stock
    if (lowStockProducts.length > 0) {
      for (const prod of lowStockProducts) {
        const isOutOfStock = prod.stock <= 0;
        const notifType = isOutOfStock ? 'out_of_stock' : 'low_stock';
        const notifTitle = isOutOfStock ? 'Product Out of Stock' : 'Low Stock Alert';
        const notifMsg = isOutOfStock
          ? `"${prod.name}" is now out of stock!`
          : `"${prod.name}" is running low — only ${prod.stock} left in stock!`;

        await notifyAdmins(io, {
          type: notifType,
          title: notifTitle,
          message: notifMsg,
          link: '/admin/inventory'
        });
        await notifyEmployees(io, {
          type: notifType,
          title: notifTitle,
          message: notifMsg,
          link: '/employee/inventory'
        });
      }
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Update coupon usage count if coupon was used
    if (couponCode) {
      try {
        const coupon = await Coupon.findOneAndUpdate(
          { code: couponCode.toUpperCase() },
          { $inc: { usedCount: 1 } },
          { new: true }
        );
        if (!coupon) {
          console.warn(`Coupon not found for code: ${couponCode.toUpperCase()}`);
        } else {
          console.log(`Coupon usage updated: ${couponCode.toUpperCase()}, new usedCount: ${coupon.usedCount + 1}`);
        }
      } catch (couponErr) {
        console.error('Error updating coupon usage:', couponErr.message);
      }
    }

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

// @DELETE /api/orders/:id - Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    await Order.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Order deleted' });
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

    // Apply cancellation fee if order is being cancelled and current status is 'shipped'
    if (status === 'cancelled' && order.orderStatus === 'shipped') {
      const settings = await LoyaltyCouponSettings.findOne({ key: 'global' });
      const fee = settings ? (settings.cancellationFee || 100) : 100;
      order.cancellationFee = fee;
      order.refundAmount = Math.max(0, order.total - fee);
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, timestamp: new Date(), note });
    if (status === 'delivered') order.deliveredAt = new Date();
    await order.save();

    if (status === 'confirmed' && !order.shiprocketOrderId) {
      createShiprocketOrder(order._id).catch(err => console.error("Shiprocket async error:", err));
    }

    // Notify customer about order status update
    const statusLabels = {
      confirmed: 'confirmed',
      processing: 'being processed',
      shipped: 'shipped',
      out_for_delivery: 'out for delivery',
      delivered: 'delivered',
      cancelled: 'cancelled',
      returned: 'returned'
    };
    const io = req.app.get('io');
    const label = statusLabels[status] || status;
    await createNotification(io, {
      recipient: order.user,
      recipientRole: 'customer',
      type: 'order_status',
      title: 'Order Status Updated',
      message: `Your order #${order.orderNumber} has been ${label}.`,
      link: '/orders',
      relatedId: order._id
    });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/orders/:id/cancel - Customer cancel order
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    // Check ownership
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Check if cancelable
    const nonCancelable = ['delivered', 'cancelled', 'returned'];
    if (nonCancelable.includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: `Cannot cancel an order that is already ${order.orderStatus}` });
    }

    let cancellationFee = 0;
    let note = 'Order cancelled by customer.';

    // Apply cancellation fee if order has been shipped
    if (order.orderStatus === 'shipped') {
      const settings = await LoyaltyCouponSettings.findOne({ key: 'global' });
      cancellationFee = settings ? (settings.cancellationFee || 100) : 100;
      order.cancellationFee = cancellationFee;
      order.refundAmount = Math.max(0, order.total - cancellationFee);
      note += ` Shipped order cancellation fee of ₹${cancellationFee} applied.`;
    } else {
      order.refundAmount = order.total;
    }

    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }

    order.orderStatus = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', timestamp: new Date(), note });
    await order.save();

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
