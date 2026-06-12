const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Order, Payment } = require('../models/index');

// Create Razorpay order
router.post('/razorpay/create-order', protect, async (req, res) => {
  try {
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    const { amount, orderId } = req.body;
    const options = {
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_${orderId}`
    };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify Razorpay payment
router.post('/razorpay/verify', protect, async (req, res) => {
  try {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString()).digest('hex');
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid', paymentId: razorpay_payment_id,
      orderStatus: 'confirmed',
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Payment confirmed' } }
    });
    await Payment.create({
      order: orderId, user: req.user._id,
      amount: req.body.amount, gateway: 'razorpay',
      gatewayPaymentId: razorpay_payment_id,
      gatewayOrderId: razorpay_order_id,
      status: 'success'
    });
    res.json({ success: true, message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// COD order confirmation
router.post('/cod/confirm', protect, async (req, res) => {
  try {
    const { orderId } = req.body;
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'pending', orderStatus: 'confirmed',
      $push: { statusHistory: { status: 'confirmed', timestamp: new Date(), note: 'Cash on Delivery confirmed' } }
    });
    res.json({ success: true, message: 'COD order confirmed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Stripe payment intent
router.post('/stripe/create-intent', protect, async (req, res) => {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr'
    });
    res.json({ success: true, clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
