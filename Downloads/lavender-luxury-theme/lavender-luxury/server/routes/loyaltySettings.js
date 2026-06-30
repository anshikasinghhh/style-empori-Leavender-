const express = require('express');
const router = express.Router();
const LoyaltyCouponSettings = require('../models/LoyaltyCouponSettings');
const { protect } = require('../middleware/auth');

// Helper: ensure singleton settings doc exists
const getOrCreateSettings = async () => {
  let settings = await LoyaltyCouponSettings.findOne({ key: 'global' });
  if (!settings) {
    settings = await LoyaltyCouponSettings.create({ key: 'global' });
  }
  return settings;
};

// @GET /api/loyalty-settings — accessible by admin + employee (any authenticated user)
router.get('/', protect, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @PUT /api/loyalty-settings — accessible by admin + employee
router.put('/', protect, async (req, res) => {
  try {
    // Only admin and employee can update
    if (!['admin', 'employee'].includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const {
      enabled,
      orderMilestone,
      couponType,
      discountValue,
      minOrderValue,
      maxDiscount,
      expiryDays,
      cancellationFee
    } = req.body;

    const settings = await LoyaltyCouponSettings.findOneAndUpdate(
      { key: 'global' },
      {
        ...(enabled !== undefined && { enabled }),
        ...(orderMilestone && { orderMilestone: Number(orderMilestone) }),
        ...(couponType && { couponType }),
        ...(discountValue && { discountValue: Number(discountValue) }),
        ...(minOrderValue !== undefined && { minOrderValue: Number(minOrderValue) }),
        ...(maxDiscount !== undefined && { maxDiscount: Number(maxDiscount) }),
        ...(expiryDays && { expiryDays: Number(expiryDays) }),
        ...(cancellationFee !== undefined && { cancellationFee: Number(cancellationFee) }),
        lastUpdatedBy: req.user._id
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
