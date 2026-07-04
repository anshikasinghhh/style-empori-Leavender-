const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { protect, authorize, adminOrEmployee } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');
const GiftCard = require('../models/GiftCard');
const GiftCardTier = require('../models/GiftCardTier');
const { sendGiftCardEmail } = require('../services/giftCardEmail');

/* ─── Razorpay helpers (same pattern as payments.js) ─── */
const PLACEHOLDER_KEYS = new Set(['your_razorpay_key_id', 'your_razorpay_key_secret', 'rzp_test_xxxxxxxx', '']);

const getRazorpayConfig = () => {
  const keyId = (process.env.RAZORPAY_KEY_ID || '').trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || '').trim();
  const configured = keyId && keySecret && !PLACEHOLDER_KEYS.has(keyId) && !PLACEHOLDER_KEYS.has(keySecret);
  return { keyId, keySecret, configured };
};

const razorpayErrorMessage = (err) =>
  err?.error?.description || err?.error?.reason || err?.description || err?.message || 'Razorpay error';

const getRazorpayClient = () => {
  const { keyId, keySecret, configured } = getRazorpayConfig();
  if (!configured) {
    const error = new Error('Razorpay is not configured');
    error.statusCode = 503;
    throw error;
  }
  const Razorpay = require('razorpay');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

/* ═══════════════════════════════════════════════════════════
   CUSTOMER ROUTES
   ═══════════════════════════════════════════════════════════ */

// POST /api/giftcards/create-order — Create Razorpay order for gift card purchase
router.post('/create-order', protect, async (req, res) => {
  try {
    const { keyId, configured } = getRazorpayConfig();
    if (!configured) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured' });
    }

    const { amount, recipientName, recipientEmail, senderName, personalMessage } = req.body;

    if (!amount || !recipientName || !recipientEmail || !senderName) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Validate amount against active tiers in DB
    const validTier = await GiftCardTier.findOne({ amount: Number(amount), isActive: true });
    if (!validTier) {
      return res.status(400).json({ success: false, message: 'Invalid gift card amount' });
    }

    const amountPaise = Math.round(Number(amount) * 100);
    const razorpay = getRazorpayClient();
    const receipt = `gc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`.slice(0, 40);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt,
      notes: {
        type: 'gift_card',
        senderName,
        recipientName,
        recipientEmail,
        amount: String(amount),
      },
    });

    res.json({
      success: true,
      order: razorpayOrder,
      key: keyId,
      amount: Number(amount),
    });
  } catch (err) {
    console.error('Gift card create-order error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: razorpayErrorMessage(err) });
  }
});

// POST /api/giftcards/verify-payment — Verify Razorpay payment and create gift card
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const { keySecret, configured } = getRazorpayConfig();
    if (!configured) {
      return res.status(503).json({ success: false, message: 'Razorpay is not configured' });
    }

    const {
      razorpay_order_id, razorpay_payment_id, razorpay_signature,
      amount, recipientName, recipientEmail, senderName, personalMessage,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(body).digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Generate unique gift code
    const giftCode = await GiftCard.generateCode();

    // Set expiry to 1 year from now
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // Create gift card
    const giftCard = await GiftCard.create({
      giftCode,
      amount: Number(amount),
      remainingBalance: Number(amount),
      senderName,
      recipientName,
      recipientEmail,
      personalMessage: personalMessage || '',
      expiryDate,
      status: 'active',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      createdBy: req.user._id,
    });

    // Send email (non-blocking)
    sendGiftCardEmail({
      recipientEmail,
      recipientName,
      senderName,
      giftCode,
      amount: Number(amount),
      personalMessage: personalMessage || '',
      expiryDate,
    }).catch(err => console.error('Gift card email failed:', err.message));

    res.json({
      success: true,
      message: 'Gift card purchased successfully!',
      giftCard: {
        giftCode: giftCard.giftCode,
        amount: giftCard.amount,
        recipientName: giftCard.recipientName,
        recipientEmail: giftCard.recipientEmail,
        expiryDate: giftCard.expiryDate,
      },
    });
  } catch (err) {
    console.error('Gift card verify-payment error:', err);
    res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to create gift card' });
  }
});

// POST /api/giftcards/verify — Verify gift card code for checkout
router.post('/verify', async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Gift card code is required' });
    }

    const giftCard = await GiftCard.findOne({ giftCode: code.trim().toUpperCase() });
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Invalid gift card code' });
    }

    // Check expiry
    await giftCard.checkExpiry();

    if (giftCard.status !== 'active') {
      const statusMessages = {
        redeemed: 'This gift card has been fully redeemed',
        expired: 'This gift card has expired',
        deactivated: 'This gift card has been deactivated',
      };
      return res.status(400).json({ success: false, message: statusMessages[giftCard.status] || 'Gift card is not active' });
    }

    if (giftCard.remainingBalance <= 0) {
      return res.status(400).json({ success: false, message: 'This gift card has no remaining balance' });
    }

    res.json({
      success: true,
      giftCard: {
        giftCode: giftCard.giftCode,
        amount: giftCard.amount,
        remainingBalance: giftCard.remainingBalance,
        expiryDate: giftCard.expiryDate,
      },
    });
  } catch (err) {
    console.error('Gift card verify error:', err);
    res.status(500).json({ success: false, message: 'Failed to verify gift card' });
  }
});

// POST /api/giftcards/redeem — Redeem gift card balance for an order
router.post('/redeem', protect, async (req, res) => {
  try {
    const { code, orderId, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({ success: false, message: 'Code and amount are required' });
    }

    const giftCard = await GiftCard.findOne({ giftCode: code.trim().toUpperCase() });
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Invalid gift card code' });
    }

    await giftCard.checkExpiry();

    if (giftCard.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Gift card is not active' });
    }

    if (giftCard.remainingBalance <= 0) {
      return res.status(400).json({ success: false, message: 'No remaining balance' });
    }

    const redeemAmount = Math.min(Number(amount), giftCard.remainingBalance);
    giftCard.remainingBalance = Math.round((giftCard.remainingBalance - redeemAmount) * 100) / 100;

    if (giftCard.remainingBalance <= 0) {
      giftCard.remainingBalance = 0;
      giftCard.status = 'redeemed';
      giftCard.isRedeemed = true;
    }

    if (orderId) {
      giftCard.redemptionHistory.push({ orderId, amount: redeemAmount });
    }

    await giftCard.save();

    res.json({
      success: true,
      redeemed: redeemAmount,
      remainingBalance: giftCard.remainingBalance,
    });
  } catch (err) {
    console.error('Gift card redeem error:', err);
    res.status(500).json({ success: false, message: 'Failed to redeem gift card' });
  }
});

// GET /api/giftcards/:code — Get gift card details by code
router.get('/:code', async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({ giftCode: req.params.code.trim().toUpperCase() });
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }

    await giftCard.checkExpiry();

    res.json({
      success: true,
      giftCard: {
        giftCode: giftCard.giftCode,
        amount: giftCard.amount,
        remainingBalance: giftCard.remainingBalance,
        senderName: giftCard.senderName,
        recipientName: giftCard.recipientName,
        status: giftCard.status,
        expiryDate: giftCard.expiryDate,
        purchaseDate: giftCard.purchaseDate,
      },
    });
  } catch (err) {
    console.error('Gift card details error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch gift card' });
  }
});

/* ═══════════════════════════════════════════════════════════
   ADMIN ROUTES
   ═══════════════════════════════════════════════════════════ */

// GET /api/giftcards/admin/list — Admin: list all gift cards
router.get('/admin/list', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { giftCode: searchRegex },
        { recipientName: searchRegex },
        { recipientEmail: searchRegex },
        { senderName: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [giftCards, total, stats] = await Promise.all([
      GiftCard.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      GiftCard.countDocuments(query),
      GiftCard.aggregate([
        {
          $group: {
            _id: null,
            totalSold: { $sum: 1 },
            totalRevenue: { $sum: '$amount' },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            redeemed: { $sum: { $cond: [{ $eq: ['$status', 'redeemed'] }, 1, 0] } },
            expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } },
            deactivated: { $sum: { $cond: [{ $eq: ['$status', 'deactivated'] }, 1, 0] } },
          },
        },
      ]),
    ]);

    res.json({
      success: true,
      giftCards,
      total,
      stats: stats[0] || { totalSold: 0, totalRevenue: 0, active: 0, redeemed: 0, expired: 0, deactivated: 0 },
    });
  } catch (err) {
    console.error('Admin gift cards list error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch gift cards' });
  }
});

// PUT /api/giftcards/admin/:id — Admin: update gift card status
router.put('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['active', 'deactivated', 'expired'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const giftCard = await GiftCard.findById(req.params.id);
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }

    giftCard.status = status;
    if (status === 'deactivated' || status === 'expired') {
      giftCard.remainingBalance = 0;
    }

    await giftCard.save();

    res.json({ success: true, message: 'Gift card updated', giftCard });
  } catch (err) {
    console.error('Admin gift card update error:', err);
    res.status(500).json({ success: false, message: 'Failed to update gift card' });
  }
});

// DELETE /api/giftcards/admin/:id — Admin: delete gift card
router.delete('/admin/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const giftCard = await GiftCard.findById(req.params.id);
    if (!giftCard) {
      return res.status(404).json({ success: false, message: 'Gift card not found' });
    }

    await GiftCard.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: 'Gift card deleted' });
  } catch (err) {
    console.error('Admin gift card delete error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete gift card' });
  }
});

/* ═══════════════════════════════════════════════════════════
   GIFT CARD TIER ROUTES (Admin / Employee)
   ═══════════════════════════════════════════════════════════ */

// GET /api/giftcards/tiers — Public: get active tiers
router.get('/tiers', async (req, res) => {
  try {
    const tiers = await GiftCardTier.find({ isActive: true }).sort({ sortOrder: 1 });
    res.json({ success: true, tiers });
  } catch (err) {
    console.error('Get tiers error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tiers' });
  }
});

// GET /api/giftcards/tiers/all — Admin/Employee: get all tiers (including inactive)
router.get('/tiers/all', protect, adminOrEmployee, async (req, res) => {
  try {
    const tiers = await GiftCardTier.find().sort({ sortOrder: 1 });
    res.json({ success: true, tiers });
  } catch (err) {
    console.error('Get all tiers error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch tiers' });
  }
});

// POST /api/giftcards/tiers — Admin/Employee: create tier
router.post('/tiers', protect, adminOrEmployee, async (req, res) => {
  try {
    const { name, amount, bonusAmount, benefits, sortOrder, color } = req.body;

    if (!name || !amount) {
      return res.status(400).json({ success: false, message: 'Name and amount are required' });
    }

    const existing = await GiftCardTier.findOne({ amount: Number(amount) });
    if (existing) {
      return res.status(400).json({ success: false, message: `A tier with amount ₹${amount} already exists` });
    }

    const tier = await GiftCardTier.create({
      name,
      amount: Number(amount),
      bonusAmount: Number(bonusAmount) || 0,
      benefits: benefits || [],
      sortOrder: sortOrder || 0,
      color: color || '#6B21A8',
      isActive: true,
    });

    res.status(201).json({ success: true, tier });
  } catch (err) {
    console.error('Create tier error:', err);
    res.status(500).json({ success: false, message: 'Failed to create tier' });
  }
});

// PUT /api/giftcards/tiers/:id — Admin/Employee: update tier
router.put('/tiers/:id', protect, adminOrEmployee, async (req, res) => {
  try {
    const { name, amount, bonusAmount, benefits, sortOrder, color, isActive } = req.body;
    const tier = await GiftCardTier.findById(req.params.id);
    if (!tier) return res.status(404).json({ success: false, message: 'Tier not found' });

    // Check if amount is being changed to an existing one
    if (amount !== undefined && Number(amount) !== tier.amount) {
      const existing = await GiftCardTier.findOne({ amount: Number(amount), _id: { $ne: tier._id } });
      if (existing) {
        return res.status(400).json({ success: false, message: `A tier with amount ₹${amount} already exists` });
      }
    }

    if (name !== undefined) tier.name = name;
    if (amount !== undefined) tier.amount = Number(amount);
    if (bonusAmount !== undefined) tier.bonusAmount = Number(bonusAmount);
    if (benefits !== undefined) tier.benefits = benefits;
    if (sortOrder !== undefined) tier.sortOrder = sortOrder;
    if (color !== undefined) tier.color = color;
    if (isActive !== undefined) tier.isActive = isActive;

    await tier.save();
    res.json({ success: true, tier });
  } catch (err) {
    console.error('Update tier error:', err);
    res.status(500).json({ success: false, message: 'Failed to update tier' });
  }
});

// DELETE /api/giftcards/tiers/:id — Admin/Employee: delete tier
router.delete('/tiers/:id', protect, adminOrEmployee, async (req, res) => {
  try {
    const tier = await GiftCardTier.findById(req.params.id);
    if (!tier) return res.status(404).json({ success: false, message: 'Tier not found' });

    await GiftCardTier.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tier deleted' });
  } catch (err) {
    console.error('Delete tier error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete tier' });
  }
});

module.exports = router;
