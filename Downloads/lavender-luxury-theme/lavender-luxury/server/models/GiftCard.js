const mongoose = require('mongoose');
const crypto = require('crypto');

const giftCardSchema = new mongoose.Schema({
  giftCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  remainingBalance: {
    type: Number,
    required: true,
    min: 0,
  },
  senderName: {
    type: String,
    required: true,
    trim: true,
  },
  recipientName: {
    type: String,
    required: true,
    trim: true,
  },
  recipientEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  personalMessage: {
    type: String,
    default: '',
    maxlength: 500,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['active', 'redeemed', 'expired', 'deactivated'],
    default: 'active',
    index: true,
  },
  isRedeemed: {
    type: Boolean,
    default: false,
  },
  paymentId: {
    type: String,
    default: '',
  },
  orderId: {
    type: String,
    default: '',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  redemptionHistory: [{
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    date: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Generate unique gift code: LAV-XXXX-XXXX
giftCardSchema.statics.generateCode = async function () {
  let code;
  let exists = true;
  while (exists) {
    const hex1 = crypto.randomBytes(2).toString('hex').toUpperCase();
    const hex2 = crypto.randomBytes(2).toString('hex').toUpperCase();
    code = `LAV-${hex1}-${hex2}`;
    exists = await this.findOne({ giftCode: code });
  }
  return code;
};

// Auto-expire check
giftCardSchema.methods.checkExpiry = function () {
  if (this.status === 'active' && new Date() > this.expiryDate) {
    this.status = 'expired';
    return this.save();
  }
  return this;
};

module.exports = mongoose.model('GiftCard', giftCardSchema);
