const mongoose = require('mongoose');

const loyaltyCouponSettingsSchema = new mongoose.Schema({
  // Use a singleton key so only one settings doc exists
  key: { type: String, default: 'global', unique: true },
  enabled: { type: Boolean, default: true },
  orderMilestone: { type: Number, default: 5, min: 1 }, // Every Nth order
  couponType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, default: 15, min: 1 }, // % or flat ₹
  minOrderValue: { type: Number, default: 1000 },
  maxDiscount: { type: Number, default: 1500 }, // max cap for percentage type
  expiryDays: { type: Number, default: 90 }, // days from earning date
  lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('LoyaltyCouponSettings', loyaltyCouponSettingsSchema);
