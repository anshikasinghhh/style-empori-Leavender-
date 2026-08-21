const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const { Order, Payment } = require('../models/index');
const { createShiprocketOrder } = require('../services/shiprocketService');

const PLACEHOLDER_KEYS = new Set([
  'your_razorpay_key_id',
  'your_razorpay_key_secret',
  'rzp_test_xxxxxxxx',
  ''
]);

const getRazorpayConfig = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const configured = keyId && keySecret && !PLACEHOLDER_KEYS.has(keyId) && !PLACEHOLDER_KEYS.has(keySecret);
  return { keyId, keySecret, configured };
};

const razorpayErrorMessage = (err) =>
  err?.error?.description ||
  err?.error?.reason ||
  err?.description ||
  err?.message ||
  'Razorpay payment gateway error';

const getRazorpayClient = () => {
  const { keyId, keySecret, configured } = getRazorpayConfig();
  if (!configured) {
    const error = new Error('Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env');
    error.statusCode = 503;
    throw error;
  }
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

const loadOrderForPayment = async (orderId, userId) => {
  const order = await Order.findById(orderId);
  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }
  if (order.user.toString() !== userId.toString()) {
    const error = new Error('Access denied');
    error.statusCode = 403;
    throw error;
  }
  return order;
};

// Create Razorpay order
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const { keyId, configured } = getRazorpayConfig();
    if (!configured) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Add valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env'
      });
    }

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    const order = await loadOrderForPayment(orderId, req.user._id);
    const amountPaise = Math.round(Number(order.total) * 100);

    if (!Number.isFinite(amountPaise) || amountPaise < 100) {
      return res.status(400).json({ success: false, message: 'Invalid order amount. Minimum payment is ₹1.' });
    }

    const razorpay = getRazorpayClient();
    const receipt = `rcpt_${String(orderId).slice(-10)}_${Date.now()}`.slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: { orderId: String(orderId), orderNumber: order.orderNumber || '' }
    });

    res.json({ success: true, order: razorpayOrder, key: keyId, amount: order.total });
  } catch (err) {
    console.error('Razorpay create-order error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: razorpayErrorMessage(err) });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const { keySecret, configured } = getRazorpayConfig();
    if (!configured) {
      return res.status(503).json({
        success: false,
        message: 'Razorpay is not configured. Add valid RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to server/.env'
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const order = await loadOrderForPayment(orderId, req.user._id);

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      paymentId: razorpay_payment_id,
      orderStatus: 'confirmed',
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment confirmed via Razorpay' } }
    });

    // Sync order to Shiprocket
    createShiprocketOrder(orderId).catch(err => console.error("Shiprocket sync error:", err));

    await Payment.create({
      order: orderId,
      user: req.user._id,
      amount: order.total,
      gateway: 'razorpay',
      gatewayPaymentId: razorpay_payment_id,
      gatewayOrderId: razorpay_order_id,
      status: 'success'
    });

    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    console.error('Razorpay verify error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: razorpayErrorMessage(err) });
  }
});

// COD order confirmation
router.post('/cod/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required' });
    }

    await loadOrderForPayment(orderId, req.user._id);

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'pending',
      orderStatus: 'confirmed',
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Cash on Delivery confirmed' } }
    });

    // Sync order to Shiprocket
    createShiprocketOrder(orderId).catch(err => console.error("Shiprocket sync error:", err));

    res.json({ success: true, message: 'COD order confirmed' });
  } catch (err) {
    console.error('COD confirm error:', err);
    const status = err.statusCode || 500;
    res.status(status).json({ success: false, message: err.message || 'Failed to confirm COD order' });
  }
});

// Stripe payment intent
router.post('/stripe/create-intent', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'inr'
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
